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
      console.log('📸 Fetching photography images from:', `${API_URL}/images/photography`);
      const response = await fetch(`${API_URL}/images/photography`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Photography fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch photography: ${response.status}`);
      }
      const data = await response.json();
      console.log('✅ Photography data:', data);
      return data;
    } catch (error) {
      console.error('❌ Photography fetch error:', error);
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

  // Upload gallery image (file)
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

  // Upload photography image (file) - JPEG only
  uploadPhotography: async (formData, token) => {
    try {
      console.log('📤 Uploading to:', `${API_URL}/images/photography`);
      
      const response = await fetch(`${API_URL}/images/photography`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || 'Upload failed';
        } catch (e) {
          const errorText = await response.text();
          errorMessage = errorText || 'Upload failed';
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ Upload successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Photography upload error:', error);
      throw error;
    }
  },

  // Upload image by URL (with secret)
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
  },

  // Delete all images
  deleteAllImages: async (token) => {
    try {
      const response = await fetch(`${API_URL}/images`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete all failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Delete all error:', error);
      throw error;
    }
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email, password, role = 'user') => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

// Default export for backward compatibility
export default galleryAPI;