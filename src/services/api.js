import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all images
export const getImages = async () => {
  try {
    const response = await api.get('/images');
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error.response?.data || error.message;
  }
};

// Upload image file
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
    console.error('Error uploading image:', error);
    throw error.response?.data || error.message;
  }
};

// 🔒 Upload image by URL - POST method
export const uploadImageByUrl = async (imageUrl, title) => {
  try {
    const secretKey = import.meta.env.VITE_UPLOAD_SECRET || 'my-super-secret-upload-key-2026-xyz789';
    
    // ✅ Using POST method
    const response = await api.post('/images/url', { 
      imageUrl, 
      title,
      secret: secretKey
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image by URL:', error);
    throw error.response?.data || error.message;
  }
};

// Delete image
export const deleteImage = async (id) => {
  try {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error.response?.data || error.message;
  }
};

// Delete all images
export const deleteAllImages = async () => {
  try {
    const response = await api.delete('/images');
    return response.data;
  } catch (error) {
    console.error('Error deleting all images:', error);
    throw error.response?.data || error.message;
  }
};

export default api;