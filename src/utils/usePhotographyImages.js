// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect, useCallback } from 'react';
import { getPhotographyImages, uploadPhotographyImage, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const loadPhotographyImages = useCallback(async () => {
    try {
      setPhotographyLoading(true);
      setError(null);
      const data = await getPhotographyImages();
      console.log('📸 Loaded photography images:', data);
      setPhotographyImages(data || []);
    } catch (err) {
      console.error('❌ Load photography error:', err);
      setError(err.message || 'Failed to load photography images');
      toast.error('Failed to load photography images');
    } finally {
      setPhotographyLoading(false);
    }
  }, [toast]);

  // ✅ This accepts a file and uploads it
  const addPhotographyImage = useCallback(async (file, title) => {
    try {
      const loadingId = toast.loading('Uploading photography image...');
      console.log('📤 Starting upload:', { title, fileSize: file.size });
      
      const result = await uploadPhotographyImage(file, title);
      
      toast.dismissById(loadingId);
      
      if (result && result.id) {
        toast.success(`✅ "${title}" uploaded to Photography!`);
        await loadPhotographyImages();
        return { success: true, data: result };
      } else {
        toast.error('Upload failed - no response');
        return { success: false, error: 'Upload failed - no response' };
      }
    } catch (err) {
      console.error('❌ Add photography error:', err);
      toast.error(err.message || 'Failed to upload photography image');
      return { success: false, error: err.message };
    }
  }, [loadPhotographyImages, toast]);

  const removePhotographyImage = useCallback(async (id) => {
    try {
      await deleteImage(id);
      toast.success('✅ Photography image deleted successfully!');
      await loadPhotographyImages();
      return { success: true };
    } catch (err) {
      console.error('❌ Delete photography error:', err);
      toast.error(err.message || 'Failed to delete photography image');
      return { success: false, error: err.message };
    }
  }, [loadPhotographyImages, toast]);

  const clearAllPhotographyImages = useCallback(async () => {
    try {
      await deleteAllImages();
      toast.success('✅ All photography images deleted successfully!');
      await loadPhotographyImages();
      return { success: true };
    } catch (err) {
      console.error('❌ Clear all photography error:', err);
      toast.error(err.message || 'Failed to delete all photography images');
      return { success: false, error: err.message };
    }
  }, [loadPhotographyImages, toast]);

  useEffect(() => {
    loadPhotographyImages();
  }, [loadPhotographyImages]);

  return {
    photographyImages,
    photographyLoading,
    error,
    addPhotographyImage,
    removePhotographyImage,
    clearAllPhotographyImages,
    refresh: loadPhotographyImages
  };
}

export default usePhotographyImages;