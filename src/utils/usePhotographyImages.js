// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect } from 'react';
import { 
  getPhotographyImages, 
  uploadPhotographyImage, 
  deleteImage, 
  deleteAllImages 
} from '../services/api';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadImages = async () => {
    try {
      setPhotographyLoading(true);
      const data = await getPhotographyImages();
      setPhotographyImages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error loading photography images:', error);
      setError(error.message || 'Failed to load photography images');
      setPhotographyImages([]);
    } finally {
      setPhotographyLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const addPhotographyImage = async (file, title) => {
    try {
      const result = await uploadPhotographyImage(file, title);
      if (result.id) {
        setPhotographyImages(prev => [result, ...prev]);
        return { success: true, image: result };
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading photography image:', error);
      throw error;
    }
  };

  const removePhotographyImage = async (id) => {
    try {
      const result = await deleteImage(id);
      if (result.success) {
        setPhotographyImages(prev => prev.filter(img => img.id !== id));
        return result;
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting photography image:', error);
      throw error;
    }
  };

  const clearAllPhotographyImages = async () => {
    try {
      const result = await deleteAllImages();
      if (result.success) {
        setPhotographyImages([]);
        return result;
      } else {
        throw new Error(result.error || 'Clear all failed');
      }
    } catch (error) {
      console.error('Error clearing photography images:', error);
      throw error;
    }
  };

  return {
    photographyImages,
    photographyLoading,
    error,
    loadImages,
    addPhotographyImage,
    removePhotographyImage,
    clearAllPhotographyImages
  };
}

export default usePhotographyImages;