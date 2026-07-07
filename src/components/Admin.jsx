// frontend/src/components/Admin.js
import React, { useState, useRef } from 'react';
import { 
  FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt, 
  FaLink, FaCloudUploadAlt, FaImage, FaCamera 
} from 'react-icons/fa';
import useToast from '../hooks/useToast';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import './Admin.css';

function Admin({ 
  images = [], 
  addImageFromUrl, 
  deleteImage,
  photographyImages = [],
  addPhotographyImage,
  deletePhotographyImage,
  onLogout,
  refreshPhotography 
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
  const [activeTab, setActiveTab] = useState('gallery');
  const fileInputRef = useRef(null);
  
  const toast = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://artistproject-backend.vercel.app/api';

  // ========== IMAGE COMPRESSION HELPER ==========
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
          if (typeof addImageFromUrl === 'function') {
            await addImageFromUrl(imageUrl.trim(), newImageTitle.trim());
            setImageUrl('');
            setNewImageTitle('');
            setPreviewUrl('');
            toast.success('✅ Gallery image added successfully!');
          } else {
            toast.error('addImageFromUrl is not available');
          }
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

  // ========== PHOTOGRAPHY UPLOAD - DIRECT TO CLOUDINARY ==========
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      toast.error('Please select a JPEG image file');
      e.target.value = '';
      return;
    }
    
    const fileSizeMB = file.size / (1024 * 1024);
    console.log(`📁 Original file size: ${fileSizeMB.toFixed(2)} MB`);

    let finalFile = file;
    
    if (fileSizeMB > 2) {
      setIsCompressing(true);
      const loadingId = toast.loading(`Compressing ${fileSizeMB.toFixed(1)}MB image...`);
      
      try {
        finalFile = await compressImage(file, 1200, 1200, 0.85);
        const compressedSizeMB = finalFile.size / (1024 * 1024);
        console.log(`✅ Compressed: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB`);
        toast.dismissById(loadingId);
        toast.success(`Image compressed to ${compressedSizeMB.toFixed(1)}MB`);
      } catch (error) {
        console.error('Compression error:', error);
        toast.dismissById(loadingId);
        toast.warning('Could not compress image. Uploading original.');
      } finally {
        setIsCompressing(false);
      }
    }

    const finalSizeMB = finalFile.size / (1024 * 1024);
    if (finalSizeMB > 4) {
      toast.error(`Image too large (${finalSizeMB.toFixed(1)}MB). Please choose a smaller image.`);
      e.target.value = '';
      return;
    }
    
    setPhotoFile(finalFile);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(finalFile);
  };
// frontend/src/components/Admin.js - Update handlePhotographySubmit

const handlePhotographySubmit = async (e) => {
  e.preventDefault();
  
  if (!photoFile || !photoTitle.trim()) {
    toast.warning('Please select an image and enter a title');
    return;
  }

  // ✅ Check for duplicate title
  const existing = photographyImages.find(
    img => img.title.toLowerCase() === photoTitle.trim().toLowerCase()
  );
  
  if (existing) {
    toast.error(`"${photoTitle.trim()}" already exists! Please use a different title.`);
    return;
  }

  setIsPhotoUploading(true);
  
  try {
    // Step 1: Upload to Cloudinary
    console.log('📤 Uploading to Cloudinary...');
    const cloudinaryResult = await uploadToCloudinary(photoFile, photoTitle.trim());
    console.log('✅ Cloudinary upload success:', cloudinaryResult);
    
    // Step 2: Save to database
    const token = localStorage.getItem('token');
    const requestBody = {
      title: photoTitle.trim(),
      description: photoDescription.trim() || '',
      cloudinary_id: cloudinaryResult.public_id,
      url: cloudinaryResult.secure_url,
      type: 'photography'
    };
    
    console.log('📤 Saving to database:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/images/photography/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('📊 Database response:', data);
    
    if (data.success || data.id) {
      // Clear form
      setPhotoFile(null);
      setPhotoTitle('');
      setPhotoDescription('');
      setPhotoPreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success(`✅ "${photoTitle.trim()}" uploaded successfully!`);
      
      // Refresh photography images
      if (refreshPhotography) {
        refreshPhotography();
      }
    } else {
      throw new Error(data.error || 'Save to database failed');
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
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
        if (typeof deleteImage === 'function') {
          deleteImage(id);
          toast.success(`✅ "${title}" deleted successfully!`);
        } else {
          toast.error('Delete function not available');
        }
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
        if (typeof deletePhotographyImage === 'function') {
          deletePhotographyImage(id);
          toast.success(`✅ "${title}" deleted from Photography!`);
        } else {
          toast.error('Delete function not available');
        }
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
        if (typeof deleteFn === 'function') {
          items.forEach(img => deleteFn(img.id));
          toast.success(`✅ All ${items.length} photos deleted successfully!`);
        } else {
          toast.error('Delete function not available');
        }
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
      if (typeof onLogout === 'function') {
        onLogout();
      } else {
        window.location.href = '/';
      }
    }, 500);
  };

  const sampleUrls = [
    'https://res.cloudinary.com/dj5limxeb/image/upload/v1782916298/Mother_a3sahc.jpg',
    'https://picsum.photos/seed/1/800/600',
    'https://picsum.photos/seed/2/800/600',
  ];

  const fillSampleUrl = (url) => {
    setImageUrl(url);
    setPreviewUrl(url);
    setActiveTab('gallery');
  };

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2 className="page-title">Admin Panel</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      {/* ===== TABS ===== */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <FaImage /> Gallery ({images ? images.length : 0})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'photography' ? 'active' : ''}`}
          onClick={() => setActiveTab('photography')}
        >
          <FaCamera /> Photography ({photographyImages ? photographyImages.length : 0})
        </button>
      </div>

      {/* ===== GALLERY TAB ===== */}
      {activeTab === 'gallery' && (
        <div className="admin-card gallery-card">
          <div className="card-header">
            <FaImage className="card-icon" />
            <h3>Gallery</h3>
            <span className="badge">{images ? images.length : 0}</span>
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
            <span>Total: <strong>{images ? images.length : 0}</strong></span>
            {images && images.length > 0 && (
              <button className="btn-clear" onClick={() => handleClearAll('gallery')}>
                <FaTrashAlt /> Clear All
              </button>
            )}
          </div>
          
          <div className="admin-list">
            {images && images.length === 0 ? (
              <p className="empty-message">No photos in gallery</p>
            ) : (
              images && images.map(img => (
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
      )}

      {/* ===== PHOTOGRAPHY TAB ===== */}
      {activeTab === 'photography' && (
        <div className="admin-card photography-card">
          <div className="card-header">
            <FaCamera className="card-icon" />
            <h3>Photography</h3>
            <span className="badge">{photographyImages ? photographyImages.length : 0}</span>
          </div>
          <p className="card-subtitle">Upload JPEG images (Direct to Cloudinary)</p>
          
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
              <p className="file-hint">📌 JPEG only | Auto-compressed | Direct Cloudinary Upload</p>
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
                    <FaCloudUploadAlt /> Upload to Photography
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="admin-stats">
            <span>Total: <strong>{photographyImages ? photographyImages.length : 0}</strong></span>
            {photographyImages && photographyImages.length > 0 && (
              <button className="btn-clear" onClick={() => handleClearAll('photography')}>
                <FaTrashAlt /> Clear All
              </button>
            )}
          </div>
          
          <div className="admin-list">
            {photographyImages && photographyImages.length === 0 ? (
              <p className="empty-message">No photos in photography</p>
            ) : (
              photographyImages && photographyImages.map(img => (
                <div key={img.id} className="admin-list-item">
                  <div className="admin-thumb">
                    <img src={img.url} alt={img.title} />
                  </div>
                  <div className="admin-info">
                    <span className="admin-title">{img.title}</span>
                    {img.description && (
                      <span className="admin-desc">{img.description}</span>
                    )}
                  </div>
                  <span className="admin-badge">JPEG</span>
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
      )}
    </section>
  );
}

export default Admin;