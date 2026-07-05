// frontend/src/components/PhotographyAdmin.jsx
import React, { useState } from 'react';
import { FaUpload, FaTrash, FaImage, FaSpinner, FaDownload } from 'react-icons/fa';
import './PhotographyAdmin.css';

const PhotographyAdmin = ({ 
  images = [], 
  addPhotographyImage, 
  deleteImage, 
  onLogout 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const token = localStorage.getItem('token');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if JPEG
    if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
      setError('Only JPEG/JPG images are allowed for photography');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a JPEG image');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim() || '');
    formData.append('image', selectedFile);

    try {
      const result = await addPhotographyImage(formData, token);
      
      if (result && result.success) {
        setSuccess('Photography image uploaded successfully!');
        setTitle('');
        setDescription('');
        setSelectedFile(null);
        setPreviewUrl(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result?.error || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photography image?')) {
      return;
    }

    setDeletingId(id);
    try {
      const result = await deleteImage(id, token);
      if (result && result.success) {
        setSuccess('Image deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result?.error || 'Delete failed');
      }
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="photography-admin">
      <div className="admin-header">
        <h2>
          <FaImage /> Photography Management
        </h2>
        <p>Upload and manage JPEG photography images</p>
      </div>

      {/* Upload Form */}
      <div className="upload-section">
        <h3>Upload New Photography Image</h3>
        <form onSubmit={handleUpload} className="upload-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description (optional)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fileInput">Select JPEG Image *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="fileInput"
                accept=".jpg,.jpeg,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                required
              />
              <span className="file-hint">Only JPEG/JPG images, max 10MB</span>
            </div>
          </div>

          {previewUrl && (
            <div className="preview-container">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <p className="preview-filename">{selectedFile?.name}</p>
              <p className="preview-filesize">
                {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="upload-btn"
            disabled={uploading || !selectedFile}
          >
            {uploading ? (
              <>
                <FaSpinner className="spinner" /> Uploading...
              </>
            ) : (
              <>
                <FaUpload /> Upload Photography
              </>
            )}
          </button>
        </form>
      </div>

      {/* Image List */}
      <div className="image-list-section">
        <h3>Photography Images ({images.length})</h3>
        
        {images.length === 0 ? (
          <p className="empty-message">No photography images uploaded yet.</p>
        ) : (
          <div className="image-grid">
            {images.map((image) => (
              <div key={image.id} className="image-card">
                <div className="image-card-image">
                  <img src={image.url || image.imageUrl} alt={image.title} />
                  <span className="image-type-badge">JPEG</span>
                </div>
                <div className="image-card-info">
                  <h4>{image.title}</h4>
                  {image.description && <p>{image.description}</p>}
                  <div className="image-card-meta">
                    <span className="image-id">#{image.id}</span>
                    <span className="image-date">
                      {new Date(image.created_at || image.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="delete-btn"
                    disabled={deletingId === image.id}
                  >
                    {deletingId === image.id ? (
                      <FaSpinner className="spinner" />
                    ) : (
                      <FaTrash />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="instructions-section">
        <h4>📸 Photography Upload Guidelines</h4>
        <ul>
          <li>✅ Only JPEG/JPG images are accepted</li>
          <li>✅ Maximum file size: 10MB</li>
          <li>✅ Recommended resolution: 1200x800 or higher</li>
          <li>✅ Images are optimized for web display</li>
          <li>✅ Professional photography showcase</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotographyAdmin;