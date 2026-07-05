// frontend/src/components/PhotographyAdmin.js
import React, { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTrash, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';
import useToast from '../hooks/useToast';
import './Admin.css';

function PhotographyAdmin({ 
  images, 
  addPhotographyImage, 
  deleteImage, 
  onLogout 
}) {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const toast = useToast();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photoFile || !photoTitle.trim()) {
      toast.warning('Please select an image and enter a title');
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await addPhotographyImage(photoFile, photoTitle.trim());
      
      if (result.success) {
        setPhotoFile(null);
        setPhotoTitle('');
        setPhotoPreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success(`✅ "${photoTitle.trim()}" added to Photography!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id, title) => {
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

  const handleClearAll = () => {
    if (images.length === 0) {
      toast.info('No photos to delete');
      return;
    }
    
    toast.dangerConfirm(
      `Delete all ${images.length} photos?`,
      () => {
        images.forEach(img => deleteImage(img.id));
        toast.success(`✅ All ${images.length} photos deleted!`);
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

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h2 className="page-title">Photography Admin</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> <span>Logout</span>
        </button>
      </div>

      <div className="admin-card photography-card">
        <div className="card-header">
          <FaCloudUploadAlt className="card-icon" />
          <h3>Upload JPEG to Photography</h3>
          <span className="badge">{images.length}</span>
        </div>
        <p className="card-subtitle">Upload JPEG images to Cloudinary</p>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="file-upload-container">
            <input
              type="file"
              id="photoUpload"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
              ref={fileInputRef}
              required
              className="file-input"
              disabled={isUploading}
            />
            <label htmlFor="photoUpload" className={`file-label ${isUploading ? 'disabled' : ''}`}>
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
              disabled={isUploading}
              className="title-input"
            />
            
            <button 
              type="submit" 
              className="btn-primary photography-btn"
              disabled={isUploading}
            >
              {isUploading ? (
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
          <span>Total: <strong>{images.length}</strong></span>
          {images.length > 0 && (
            <button className="btn-clear" onClick={handleClearAll}>
              <FaTrashAlt /> Clear All
            </button>
          )}
        </div>
        
        <div className="admin-list">
          {images.length === 0 ? (
            <p className="empty-message">No photos in photography</p>
          ) : (
            images.map(img => (
              <div key={img.id} className="admin-list-item">
                <div className="admin-thumb">
                  <img src={img.url} alt={img.title} />
                </div>
                <span className="admin-title">{img.title}</span>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(img.id, img.title)}
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

export default PhotographyAdmin;