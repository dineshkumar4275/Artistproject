import React, { useState, useRef } from 'react';
import {
  FaTrash, FaTrashAlt, FaSignOutAlt,
  FaLink, FaCloudUploadAlt, FaImage, FaCamera, FaGripLines
} from 'react-icons/fa';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useToast from '../hooks/useToast';
import { uploadPhotographyToNeon } from '../utils/uploadToNeonDB';
import './Admin.css';

// ----- Sortable Item Component -----
const SortablePhotoItem = ({ id, url, title, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="admin-list-item">
      <div className="admin-thumb">
        <img src={url} alt={title} />
      </div>
      <div className="admin-info">
        <span className="admin-title">{title}</span>
      </div>
      <button className="btn-danger" onClick={() => onDelete(id, title)}>
        <FaTrash />
      </button>
    </div>
  );
};

// ----- Main Admin Component -----
function Admin({
  images = [],
  photographyImages = [],
  addImageFromUrl,
  deleteImage,
  deletePhotographyImage,
  onReorderPhotography,
  refreshPhotography,
  onLogout,
}) {
  // Gallery state
  const [imageUrl, setImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Photography state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const fileInputRef = useRef(null);

  const toast = useToast();

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ----- Compression -----
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, '.jpg'),
                  { type: 'image/jpeg', lastModified: Date.now() }
                );
                resolve(compressedFile);
              } else {
                reject(new Error('Failed to compress'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // ----- Gallery URL Upload -----
  const isValidUrl = (string) => {
    try { new URL(string); return true; } catch (_) { return false; }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(isValidUrl(url) ? url : '');
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim() || !newImageTitle.trim()) {
      toast.warning('Please enter URL and title');
      return;
    }
    if (!isValidUrl(imageUrl)) {
      toast.error('Invalid URL');
      return;
    }
    setIsUploading(true);
    try {
      await addImageFromUrl(imageUrl.trim(), newImageTitle.trim());
      setImageUrl('');
      setNewImageTitle('');
      setPreviewUrl('');
      toast.success('Gallery image added');
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // ----- Photography Upload (JPEG) -----
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      toast.error('Please select a JPEG image');
      e.target.value = '';
      return;
    }
    let finalFile = file;
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 2) {
      setIsCompressing(true);
      const loadingId = toast.loading('Compressing...');
      try {
        finalFile = await compressImage(file, 1200, 1200, 0.85);
        toast.dismissById(loadingId);
        toast.success(`Compressed to ${(finalFile.size / 1024 / 1024).toFixed(1)}MB`);
      } catch (error) {
        toast.dismissById(loadingId);
        toast.warning('Compression failed, uploading original');
      } finally {
        setIsCompressing(false);
      }
    }
    const finalSizeMB = finalFile.size / (1024 * 1024);
    if (finalSizeMB > 10) {
      toast.error(`Image too large (${finalSizeMB.toFixed(1)}MB)`);
      e.target.value = '';
      return;
    }
    setPhotoFile(finalFile);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(finalFile);
  };

  const handlePhotographySubmit = async (e) => {
    e.preventDefault();
    if (!photoFile || !photoTitle.trim()) {
      toast.warning('Select image and enter title');
      return;
    }
    setIsPhotoUploading(true);
    try {
      const result = await uploadPhotographyToNeon(
        photoFile,
        photoTitle.trim(),
        photoDescription.trim()
      );
      if (result.success || result.id) {
        setPhotoFile(null);
        setPhotoTitle('');
        setPhotoDescription('');
        setPhotoPreview('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success(`"${photoTitle.trim()}" uploaded to Photography`);
        if (refreshPhotography) refreshPhotography();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // ----- Drag‑and‑Drop handler -----
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = photographyImages.findIndex((img) => img.id === active.id);
      const newIndex = photographyImages.findIndex((img) => img.id === over.id);
      const newOrder = arrayMove(photographyImages, oldIndex, newIndex);
      if (onReorderPhotography) {
        onReorderPhotography(newOrder);
      }
      // Optionally save to backend or localStorage
      // localStorage.setItem('photographyOrder', JSON.stringify(newOrder.map(img => img.id)));
    }
  };

  // ----- Delete handlers -----
  const handleDeleteGallery = (id, title) => {
    toast.dangerConfirm(
      `Delete "${title}"?`,
      () => {
        deleteImage(id);
        toast.success(`"${title}" deleted`);
      },
      () => toast.info(`"${title}" kept`)
    );
  };

  const handleDeletePhotography = (id, title) => {
    toast.dangerConfirm(
      `Delete "${title}"?`,
      () => {
        deletePhotographyImage(id);
        toast.success(`"${title}" deleted from Photography`);
      },
      () => toast.info(`"${title}" kept`)
    );
  };

  // ----- Clear All -----
  const handleClearAll = (type) => {
    const items = type === 'gallery' ? images : photographyImages;
    const deleteFn = type === 'gallery' ? deleteImage : deletePhotographyImage;
    if (items.length === 0) {
      toast.info(`No ${type} photos`);
      return;
    }
    toast.dangerConfirm(
      `Delete all ${items.length} ${type} photos?`,
      () => {
        items.forEach(img => deleteFn(img.id));
        toast.success(`All ${type} photos deleted`);
      },
      () => toast.info('No photos deleted')
    );
  };

  // ----- Logout -----
  const handleLogout = () => {
    toast.info('Logging out...');
    localStorage.removeItem('isAdminLoggedIn');
    setTimeout(() => {
      if (onLogout) onLogout();
      else window.location.href = '/';
    }, 500);
  };

  // Sample URLs for quick fill
  const sampleUrls = [
    'https://res.cloudinary.com/dj5limxeb/image/upload/v1782916298/Mother_a3sahc.jpg',
    'https://picsum.photos/seed/1/800/600',
    'https://picsum.photos/seed/2/800/600',
  ];

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2 className="page-title">Admin Panel</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <FaImage /> Gallery ({images.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'photography' ? 'active' : ''}`}
          onClick={() => setActiveTab('photography')}
        >
          <FaCamera /> Photography ({photographyImages.length})
        </button>
      </div>

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="admin-card gallery-card">
          <h3>Add Gallery Image via URL</h3>
          <form onSubmit={handleGallerySubmit} className="admin-form">
            <input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={handleUrlChange}
              disabled={isUploading}
              className="url-input"
            />
            <div className="sample-urls">
              <span>Quick:</span>
              {sampleUrls.map((url, i) => (
                <button type="button" key={i} onClick={() => { setImageUrl(url); setPreviewUrl(url); }}>
                  Sample {i+1}
                </button>
              ))}
            </div>
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
            <input
              type="text"
              placeholder="Image Title"
              value={newImageTitle}
              onChange={(e) => setNewImageTitle(e.target.value)}
              disabled={isUploading}
            />
            <button type="submit" className="btn-primary" disabled={isUploading}>
              {isUploading ? <span className="spinner"></span> : <><FaLink /> Add</>}
            </button>
          </form>
          <div className="admin-stats">
            <span>Total: <strong>{images.length}</strong></span>
            {images.length > 0 && (
              <button className="btn-clear" onClick={() => handleClearAll('gallery')}>
                <FaTrashAlt /> Clear All
              </button>
            )}
          </div>
          <div className="admin-list">
            {images.length === 0 ? (
              <p className="empty-message">No gallery images</p>
            ) : (
              images.map(img => (
                <div key={img.id} className="admin-list-item">
                  <div className="admin-thumb">
                    <img src={img.url} alt={img.title} />
                  </div>
                  <span className="admin-title">{img.title}</span>
                  <button className="btn-danger" onClick={() => handleDeleteGallery(img.id, img.title)}>
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Photography Tab with Drag‑and‑Drop */}
      {activeTab === 'photography' && (
        <div className="admin-card photography-card">
          <h3>Upload Photography (JPEG)</h3>
          <form onSubmit={handlePhotographySubmit} className="admin-form">
            <div className="file-upload-container">
              <input
                type="file"
                id="photoUpload"
                accept="image/jpeg,image/jpg"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isPhotoUploading || isCompressing}
                className="file-input"
              />
              <label htmlFor="photoUpload" className={`file-label ${isPhotoUploading || isCompressing ? 'disabled' : ''}`}>
                <FaCloudUploadAlt />
                {isCompressing ? '🔄 Compressing...' : photoFile ? photoFile.name : 'Choose JPEG'}
                {photoFile && !isCompressing && (
                  <span className="file-size">({(photoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                )}
              </label>
            </div>
            {photoPreview && (
              <div className="image-preview">
                <img src={photoPreview} alt="Preview" />
              </div>
            )}
            <input
              type="text"
              placeholder="Photo Title *"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              disabled={isPhotoUploading}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              disabled={isPhotoUploading}
            />
            <button type="submit" className="btn-primary" disabled={isPhotoUploading || isCompressing || !photoFile}>
              {isPhotoUploading ? <span className="spinner"></span> : <><FaCloudUploadAlt /> Upload</>}
            </button>
          </form>

          <div className="admin-stats">
            <span>Total: <strong>{photographyImages.length}</strong></span>
            {photographyImages.length > 0 && (
              <button className="btn-clear" onClick={() => handleClearAll('photography')}>
                <FaTrashAlt /> Clear All
              </button>
            )}
          </div>

          <h4>Drag to reorder</h4>
          <div className="admin-list">
            {photographyImages.length === 0 ? (
              <p className="empty-message">No photography images</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={photographyImages.map(img => img.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {photographyImages.map((img) => (
                    <SortablePhotoItem
                      key={img.id}
                      id={img.id}
                      url={img.url}
                      title={img.title}
                      onDelete={(id, title) => handleDeletePhotography(id, title)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Admin;