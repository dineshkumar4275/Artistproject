// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect, useCallback } from 'react';
import { galleryAPI } from '../services/api';

const usePhotographyImages = () => {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch photography images from backend
  const fetchPhotographyImages = useCallback(async () => {
    try {
      setPhotographyLoading(true);
      setError(null);
      const data = await galleryAPI.getPhotography();
      console.log('📸 Fetched photography images:', data);
      setPhotographyImages(data || []);
    } catch (error) {
      console.error('Error fetching photography images:', error);
      setError('Failed to load photography images');
      setPhotographyImages([]);
    } finally {
      setPhotographyLoading(false);
    }
  }, []);

  // Add photography image (file upload)
  const addPhotographyImage = useCallback(async (file, title) => {
    try {
      setPhotographyLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      console.log('🔑 Token:', token);
      
      if (!token) {
        return { success: false, error: 'Authentication required. Please login again.' };
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', '');
      formData.append('isFeatured', 'false');

      console.log('📤 Uploading photography image:', title);
      
      // Upload to backend
      const result = await galleryAPI.uploadPhotography(formData, token);
      console.log('✅ Upload result:', result);
      
      if (result && result.id) {
        // Refresh the list after upload
        await fetchPhotographyImages();
        return { success: true, data: result };
      }
      return { success: false, error: result?.error || 'Upload failed - no response' };
    } catch (error) {
      console.error('❌ Error adding photography image:', error);
      return { success: false, error: error.message || 'Upload failed' };
    } finally {
      setPhotographyLoading(false);
    }
  }, [fetchPhotographyImages]);

  // Remove photography image
  const removePhotographyImage = useCallback(async (id) => {
    try {
      setPhotographyLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const result = await galleryAPI.deleteImage(id, token);
      
      if (result && result.success) {
        // Remove from local state
        setPhotographyImages(prev => prev.filter(img => img.id !== id));
        return { success: true };
      }
      return { success: false, error: result?.error || 'Delete failed' };
    } catch (error) {
      console.error('Error deleting photography image:', error);
      return { success: false, error: error.message || 'Delete failed' };
    } finally {
      setPhotographyLoading(false);
    }
  }, []);

  // Clear all photography images
  const clearAllPhotographyImages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      // Delete one by one
      for (const image of photographyImages) {
        await galleryAPI.deleteImage(image.id, token);
      }
      setPhotographyImages([]);
      return { success: true };
    } catch (error) {
      console.error('Error clearing photography images:', error);
      return { success: false, error: error.message };
    }
  }, [photographyImages]);

  // Load images on mount
  useEffect(() => {
    fetchPhotographyImages();
  }, [fetchPhotographyImages]);

  return {
    photographyImages,
    photographyLoading,
    error,
    fetchPhotographyImages,
    addPhotographyImage,
    removePhotographyImage,
    clearAllPhotographyImages
  };
};

export default usePhotographyImages;