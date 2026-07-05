// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_SECRET = import.meta.env.VITE_UPLOAD_SECRET;

export const galleryAPI = {
  // Get gallery images
  getGallery: async () => {
    try {
      const response = await fetch(`${API_URL}/images`);
      if (!response.ok) throw new Error('Failed to fetch gallery');
      return await response.json();
    } catch (error) {
      console.error('Gallery fetch error:', error);
      throw error;
    }
  },

  // Get photography images
  getPhotography: async () => {
    try {
      const response = await fetch(`${API_URL}/images/photography`);
      if (!response.ok) throw new Error('Failed to fetch photography');
      return await response.json();
    } catch (error) {
      console.error('Photography fetch error:', error);
      throw error;
    }
  },

  // Get all images (combined)
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/images/all`);
      if (!response.ok) throw new Error('Failed to fetch all images');
      return await response.json();
    } catch (error) {
      console.error('Fetch all error:', error);
      throw error;
    }
  },

  // Upload gallery image
  uploadGallery: async (formData, token) => {
    try {
      const response = await fetch(`${API_URL}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  },

  // Upload photography image
  uploadPhotography: async (formData, token) => {
    try {
      const response = await fetch(`${API_URL}/images/photography`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Photography upload error:', error);
      throw error;
    }
  },

  // Upload image by URL
  uploadByUrl: async (imageUrl, title, description = '', isFeatured = false) => {
    try {
      const response = await fetch(`${API_URL}/images/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageUrl,
          title,
          description,
          isFeatured,
          secret: UPLOAD_SECRET
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      return await response.json();
    } catch (error) {
      console.error('URL upload error:', error);
      throw error;
    }
  },

  // Update image
  updateImage: async (id, data, token) => {
    try {
      const response = await fetch(`${API_URL}/images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Update failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  // Delete image
  deleteImage: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/images/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
};