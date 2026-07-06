// frontend/src/services/api.js
import axios from 'axios';

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://artistproject-backend.vercel.app/api';

console.log('🌐 API URL:', API_BASE_URL);

// ✅ Secret key for URL uploads
const UPLOAD_SECRET = import.meta.env.VITE_UPLOAD_SECRET || 'my-super-secret-upload-key-2026-xyz789';

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
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminLoginTime', Date.now().toString());
      }
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
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('adminLoginTime');
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error.response?.data || { success: false, error: error.message };
    }
  },
  
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
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
  formData.append('description', '');

  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : undefined,
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
    console.log('📤 Uploading image by URL:', imageUrl);
    
    const response = await api.post('/images/url', {
      imageUrl,
      title,
      description: '',
      isFeatured: false,
      secret: UPLOAD_SECRET
    });
    
    console.log('✅ Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading image URL:', error);
    console.error('❌ Error response:', error.response?.data);
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
  formData.append('description', '');
  formData.append('isFeatured', 'false');

  try {
    const token = localStorage.getItem('token');
    console.log('📤 Uploading photography image:', title);
    console.log('🔑 Token exists:', !!token);
    
    const response = await api.post('/images/photography', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
    });
    console.log('✅ Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error uploading photography image:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// =======================
// DELETE SINGLE IMAGE
// =======================
export const deleteImage = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/images/${id}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
    });
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
    const token = localStorage.getItem('token');
    const response = await api.delete('/images', {
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error deleting all images:', error);
    throw error.response?.data || { success: false, error: error.message };
  }
};

// ✅ SINGLE DEFAULT EXPORT - NO DUPLICATE FUNCTIONS
export default api;