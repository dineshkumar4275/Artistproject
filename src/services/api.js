import axios from 'axios';

// Use Vercel backend in production
// Use localhost when running locally
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

console.log('API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===================
// GET ALL IMAGES
// ===================
export const getImages = async () => {
  try {
    const response = await api.get('/images');
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error.response?.data || error.message;
  }
};

// ===================
// UPLOAD IMAGE FILE
// ===================
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

// ===================
// UPLOAD IMAGE BY URL
// ===================
export const uploadImageByUrl = async (imageUrl, title) => {
  try {
    const response = await api.post('/images/url', {
      imageUrl,
      title,
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image by URL:', error);
    throw error.response?.data || error.message;
  }
};

// ===================
// DELETE SINGLE IMAGE
// ===================
export const deleteImage = async (id) => {
  try {
    const response = await api.delete(`/images/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error.response?.data || error.message;
  }
};

// ===================
// DELETE ALL IMAGES
// ===================
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
