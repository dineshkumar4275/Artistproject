// frontend/src/utils/uploadToNeonDB.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://artistproject-backend.vercel.app/api';

export const uploadPhotographyToNeon = async (file, title, description) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('description', description || '');

  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/images/photography/neon-upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined
      },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};