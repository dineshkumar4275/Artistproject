// frontend/src/services/api.js
import axios from 'axios';

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://artistproject-backend.vercel.app/api';

console.log('🌐 API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// =======================
// AUTHENTICATION API
// =======================
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error.response?.data || { success: false, error: error.message };
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error.response?.data || { success: false, error: error.message };
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error.response?.data || { success: false, error: error.message };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('❌ Error getting current user:', error);
      throw error.response?.data || { success: false, error: error.message };
    }
  }
};

// =======================
// GET ALL GALLERY IMAGES
// =======================
export const getImages = async () => {
  try {
    const response = await api.get('/images');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching images:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// GET PHOTOGRAPHY IMAGES
// =======================
export const getPhotographyImages = async () => {
  try {
    const response = await api.get('/images/photography');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching photography images:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// UPLOAD GALLERY IMAGE FILE
// =======================
export const uploadImageFile = async (file, title) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);

  try {
    const response = await api.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading image file:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// UPLOAD GALLERY IMAGE USING URL
// =======================
export const uploadImageByUrl = async (imageUrl, title) => {
  try {
    const response = await api.post('/images/url', {
      imageUrl,
      title,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading image URL:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// UPLOAD PHOTOGRAPHY IMAGE - JPEG ONLY
// =======================
export const uploadPhotographyImage = async (file, title) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);

  try {
    const response = await api.post('/images/photography', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading photography image:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// DELETE SINGLE IMAGE
// =======================
export const deleteImage = async (id) => {
  try {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// DELETE ALL IMAGES
// =======================
export const deleteAllImages = async () => {
  try {
    const response = await api.delete('/images');
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting all images:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

export default api;