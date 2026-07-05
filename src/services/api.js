// frontend/src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const UPLOAD_SECRET = import.meta.env.VITE_UPLOAD_SECRET;

// ===== GALLERY IMAGES =====
export const getImages = async () => {
  try {
    const response = await fetch(`${API_URL}/images`);
    if (!response.ok) throw new Error('Failed to fetch images');
    return await response.json();
  } catch (error) {
    console.error('Get images error:', error);
    throw error;
  }
};

// ===== PHOTOGRAPHY IMAGES =====
export const getPhotographyImages = async () => {
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
};

// ===== UPLOAD IMAGE FILE =====
export const uploadImageFile = async (file, title) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', '');
    formData.append('type', 'gallery');

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
    console.error('Upload file error:', error);
    throw error;
  }
};

// ===== UPLOAD PHOTOGRAPHY IMAGE =====
export const uploadPhotographyImage = async (file, title) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('description', '');
    formData.append('isFeatured', 'false');

    console.log('📤 Uploading photography image:', title);
    
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
};

// ===== UPLOAD IMAGE BY URL =====
export const uploadImageByUrl = async (imageUrl, title) => {
  try {
    const response = await fetch(`${API_URL}/images/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        imageUrl,
        title,
        description: '',
        isFeatured: false,
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
};

// ===== DELETE SINGLE IMAGE =====
export const deleteImage = async (id) => {
  try {
    const token = localStorage.getItem('token');
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
};

// ===== DELETE ALL IMAGES =====
export const deleteAllImages = async () => {
  try {
    const token = localStorage.getItem('token');
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
};

// ===== AUTH API =====
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
export default {
  getImages,
  getPhotographyImages,
  uploadImageFile,
  uploadPhotographyImage,
  uploadImageByUrl,
  deleteImage,
  deleteAllImages,
  authAPI
};