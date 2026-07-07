// frontend/src/utils/uploadToNeonDB.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://artistproject-backend.vercel.app/api';

export const uploadPhotographyToNeon = async (file, title, description) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('description', description || '');

  try {
    const token = localStorage.getItem('token');
    
    console.log('📤 Uploading to Neon DB...');
    console.log('📤 Endpoint:', `${API_BASE_URL}/images/photography/neon-upload`);
    
    const response = await fetch(`${API_BASE_URL}/images/photography/neon-upload`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : undefined
      },
      body: formData
    });

    const data = await response.json();
    console.log('📊 Response:', response.status, data);
    
    if (!response.ok) {
      throw new Error(data.error || data.details || 'Upload failed');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};