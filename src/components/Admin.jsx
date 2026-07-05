import React, { useState, useRef } from 'react';
import { 
  FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt, 
  FaLink, FaCloudUploadAlt, FaImage, FaCamera 
} from 'react-icons/fa';
import useToast from '../hooks/useToast';
import './Admin.css';

function Admin({ 
  images, 
  addImageFromUrl, 
  deleteImage,
  photographyImages = [],
  addPhotographyImage,
  deletePhotographyImage 
}) {
  // Gallery URL upload state
  const [imageUrl, setImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Photography file upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
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

  // ========== PHOTOGRAPHY FILE UPLOAD FUNCTIONS ==========
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        toast.error('Please select a JPEG image file');
        e.target.value = '';
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.');
        e.target.value = '';
        return;
      }
      
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotographySubmit = async (e) => {
    e.preventDefault();
    
    if (photoFile && photoTitle.trim()) {
      setIsPhotoUploading(true);
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result;
          await addPhotographyImage(base64Data, photoTitle.trim());
          setPhotoFile(null);
          setPhotoTitle('');
          setPhotoPreview('');
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          toast.success('✅ Photography image added successfully!');
        };
        reader.readAsDataURL(photoFile);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.message || 'Failed to add photography image');
      } finally {
        setIsPhotoUploading(false);
      }
    } else {
      toast.warning('Please select an image and enter a title');
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
      window.location.href = '/';
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
        <p className="card-subtitle">Upload JPEG images</p>
        
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
              disabled={isPhotoUploading}
            />
            <label htmlFor="photoUpload" className={`file-label ${isPhotoUploading ? 'disabled' : ''}`}>
              <FaCloudUploadAlt />
              <span className="file-text">
                {photoFile ? photoFile.name : 'Choose JPEG image...'}
              </span>
              {photoFile && (
                <span className="file-size">
                  ({(photoFile.size / 1024).toFixed(1)} KB)
                </span>
              )}
            </label>
            <p className="file-hint">📌 Only JPEG/JPG (Max: 10MB)</p>
          </div>
          
          {photoPreview && (
            <div className="image-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
          )}
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Photo Title"
              value={photoTitle}
              onChange={(e) => setPhotoTitle(e.target.value)}
              required
              disabled={isPhotoUploading}
              className="title-input"
            />
            
            <button 
              type="submit" 
              className="btn-primary photography-btn"
              disabled={isPhotoUploading}
            >
              {isPhotoUploading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <FaCloudUploadAlt /> Upload
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