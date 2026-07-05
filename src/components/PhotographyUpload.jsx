// frontend/src/components/PhotographyUpload.jsx
import React, { useState } from 'react';
import { galleryAPI } from '../services/api';

const PhotographyUpload = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if JPEG
      if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
        setError('Only JPEG images are allowed for photography');
        setImageFile(null);
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !imageFile) {
      setError('Please fill all fields and select an image');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', imageFile);

    try {
      const result = await galleryAPI.uploadPhotography(formData, token);
      if (result.id) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setImageFile(null);
        // Reset file input
        document.getElementById('fileInput').value = '';
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="photography-upload">
      <h2>Upload Photography Image</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Image (JPEG only):</label>
          <input
            id="fileInput"
            type="file"
            accept="image/jpeg,image/jpg"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Photography'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Upload successful!</div>}
    </div>
  );
};

export default PhotographyUpload;