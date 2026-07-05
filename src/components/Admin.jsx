// frontend/src/components/Admin.js
import React, { useState, useRef } from 'react';
import { 
  FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt, 
  FaLink, FaCloudUploadAlt, FaImage, FaCamera 
} from 'react-icons/fa';
import useToast from '../hooks/useToast';
import './Admin.css';

// ===== IMAGE COMPRESSION HELPER =====
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

        // Resize if needed
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

        // Convert to JPEG with quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
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

function Admin({ 
  images, 
  addImageFromUrl, 
  deleteImage,
  photographyImages = [],
  addPhotographyImage,
  deletePhotographyImage,
  onLogout 
}) {
  // Gallery URL upload state
  const [imageUrl, setImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Photography file upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);
  
  const toast = useToast();

  // ========== GALLERY URL UPLOAD FUNCTIONS ==========
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url && isValidUrl(url)) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    
    if (imageUrl.trim() && newImageTitle.trim()) {
      if (isValidUrl(imageUrl)) {
        setIsUploading(true);
        try {
          await addImageFromUrl(imageUrl.trim(), newImageTitle.trim());
          setImageUrl('');
          setNewImageTitle('');
          setPreviewUrl('');
          toast.success('✅ Gallery image added successfully!');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(error.message || 'Failed to add image');
        } finally {
          setIsUploading(false);
        }
      } else {
        toast.error('Please enter a valid URL');
      }
    } else {
      toast.warning('Please enter both URL and title');
    }
  };

  // ========== PHOTOGRAPHY UPLOAD WITH COMPRESSION ==========
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if JPEG
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      toast.error('Please select a JPEG image file');
      e.target.value = '';
      return;
    }
    
    // Check file size
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size exceeds 20MB. Please choose a smaller image.');
      e.target.value = '';
      return;
    }

    // Show compression status
    setIsCompressing(true);
    toast.loading('Compressing image...');

    try {
      let finalFile = file;
      
      // Compress if file is larger than 2MB
      if (file.size > 2 * 1024 * 1024) {
        finalFile = await compressImage(file, 1200, 1200, 0.85);
        console.log(`✅ Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(finalFile.size / 1024 / 1024).toFixed(2)}MB`);
        toast.success(`Image compressed to ${(finalFile.size / 1024 / 1024).toFixed(2)}MB`);
      } else {
        toast.success('Image size is good for upload');
      }
      
      // Check final size
      if (finalFile.size > 10 * 1024 * 1024) {
        toast.error('Image still exceeds 10MB after compression. Please choose a smaller image.');
        e.target.value = '';
        setIsCompressing(false);
        return;
      }
      
      setPhotoFile(finalFile);
      
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(finalFile);
      
    } catch (error) {
      console.error('Compression error:', error);
      toast.warning('Could not compress image, uploading original');
      setPhotoFile(file);
      
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
    }
  };

  const handlePhotographySubmit = async (e) => {
    e.preventDefault();
    
    if (!photoFile || !photoTitle.trim()) {
      toast.warning('Please select an image and enter a title');
      return;
    }

    if (photoFile.size > 10 * 1024 * 1024) {
      toast.error('Image size exceeds 10MB. Please choose a smaller image.');
      return;
    }

    setIsPhotoUploading(true);
    
    try {
      // Upload with title and description
      const result = await addPhotographyImage(photoFile, photoTitle.trim(), photoDescription.trim());
      
      if (result.success) {
        // Clear form
        setPhotoFile(null);
        setPhotoTitle('');
        setPhotoDescription('');
        setPhotoPreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast.success(`✅ "${photoTitle.trim()}" uploaded successfully!`);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload photography image');
    } finally {
      setIsPhotoUploading(false);
    }
  };

  // ========== DELETE FUNCTIONS ==========
  const handleDeleteGallery = (id, title) => {
    toast.dangerConfirm(
      `Delete "${title}"?`,
      () => {
        deleteImage(id);
        toast.success(`✅ "${title}" deleted successfully!`);
      },
      () => {
        toast.info(`ℹ️ "${title}" was not deleted`);
      }
    );
  };

  const handleDeletePhotography = (id, title) => {
    toast.dangerConfirm(
      `Delete "${title}"?`,
      () => {
        deletePhotographyImage(id);
        toast.success(`✅ "${title}" deleted successfully!`);
      },
      () => {
        toast.info(`ℹ️ "${title}" was not deleted`);
      }
    );
  };

  const handleClearAll = (type) => {
    const items = type === 'gallery' ? images : photographyImages;
    const deleteFn = type === 'gallery' ? deleteImage : deletePhotographyImage;
    const itemName = type === 'gallery' ? 'gallery' : 'photography';
    
    if (items.length === 0) {
      toast.info(`No ${itemName} photos to delete`);
      return;
    }
    
    toast.dangerConfirm(
      `Delete all ${items.length} photos?`,
      () => {
        items.forEach(img => deleteFn(img.id));
        toast.success(`✅ All ${items.length} photos deleted successfully!`);
      },
      () => {
        toast.info('ℹ️ No photos were deleted');
      }
    );
  };

  const handleLogout = () => {
    toast.info('👋 Logging out...');
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setTimeout(() => {
      if (onLogout) {
        onLogout();
      } else {
        window.location.href = '/';
      }
    }, 500);
  };

  const sampleUrls = [
    'https://picsum.photos/seed/1/800/600',
    'https://picsum.photos/seed/2/800/600',
    'https://picsum.photos/seed/3/800/600',
  ];

  const fillSampleUrl = (url) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2 className="page-title">Admin Panel</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      {/* ===== GALLERY SECTION ===== */}
      <div className="admin-card gallery-card">
        <div className="card-header">
          <FaImage className="card-icon" />
          <h3>Gallery</h3>
          <span className="badge">{images.length}</span>
        </div>
        <p className="card-subtitle">Add images via URL</p>
        
        <form onSubmit={handleGallerySubmit} className="admin-form">
          <div className="url-upload-container">
            <input
              type="url"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={handleUrlChange}
              required
              disabled={isUploading}
              className="url-input"
            />
            <div className="sample-urls">
              <span className="sample-label">Quick:</span>
              {sampleUrls.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  className="sample-url-btn"
                  onClick={() => fillSampleUrl(url)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Image Title"
              value={newImageTitle}
              onChange={(e) => setNewImageTitle(e.target.value)}
              required
              disabled={isUploading}
              className="title-input"
            />
            
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isUploading}
            >
              {isUploading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <FaLink /> Add
                </>
              )}
            </button>
          </div>
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
            <p className="empty-message">No photos in gallery</p>
          ) : (
            images.map(img => (
              <div key={img.id} className="admin-list-item">
                <div className="admin-thumb">
                  <img src={img.url} alt={img.title} />
                </div>
                <span className="admin-title">{img.title}</span>
                <button
                  className="btn-danger"
                  onClick={() => handleDeleteGallery(img.id, img.title)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ===== PHOTOGRAPHY SECTION ===== */}
      <div className="admin-card photography-card">
        <div className="card-header">
          <FaCamera className="card-icon" />
          <h3>Photography</h3>
          <span className="badge">{photographyImages.length}</span>
        </div>
        <p className="card-subtitle">Upload JPEG images (auto-compressed)</p>
        
        <form onSubmit={handlePhotographySubmit} className="admin-form">
          <div className="file-upload-container">
            <input
              type="file"
              id="photoUpload"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
              className="file-input"
              disabled={isPhotoUploading || isCompressing}
            />
            <label htmlFor="photoUpload" className={`file-label ${isPhotoUploading || isCompressing ? 'disabled' : ''}`}>
              <FaCloudUploadAlt />
              <span className="file-text">
                {isCompressing ? '🔄 Compressing...' : photoFile ? photoFile.name : 'Choose JPEG image...'}
              </span>
              {photoFile && !isCompressing && (
                <span className="file-size">
                  ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </label>
            <p className="file-hint">📌 JPEG only | Max 20MB | Auto-compressed to under 10MB</p>
          </div>
          
          {photoPreview && (
            <div className="image-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
          )}
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Photo Title *"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              required
              disabled={isPhotoUploading}
              className="title-input"
            />
          </div>
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Photo Description (optional)"
              value={photoDescription}
              onChange={(e) => setPhotoDescription(e.target.value)}
              disabled={isPhotoUploading}
              className="title-input"
            />
          </div>
          
          <div className="form-row">
            <button 
              type="submit" 
              className="btn-primary photography-btn"
              disabled={isPhotoUploading || isCompressing || !photoFile}
            >
              {isPhotoUploading ? (
                <span className="spinner"></span>
              ) : isCompressing ? (
                '🔄 Compressing...'
              ) : (
                <>
                  <FaCloudUploadAlt /> Upload to Cloudinary
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="admin-stats">
          <span>Total: <strong>{photographyImages.length}</strong></span>
          {photographyImages.length > 0 && (
            <button className="btn-clear" onClick={() => handleClearAll('photography')}>
              <FaTrashAlt /> Clear All
            </button>
          )}
        </div>
        
        <div className="admin-list">
          {photographyImages.length === 0 ? (
            <p className="empty-message">No photos in photography</p>
          ) : (
            photographyImages.map(img => (
              <div key={img.id} className="admin-list-item">
                <div className="admin-thumb">
                  <img src={img.url} alt={img.title} />
                </div>
                <span className="admin-title">{img.title}</span>
                {img.description && <span className="admin-desc">{img.description}</span>}
                <button
                  className="btn-danger"
                  onClick={() => handleDeletePhotography(img.id, img.title)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Admin;