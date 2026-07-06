// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPhotographyImages, uploadPhotographyImage, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  // Load photography images from backend
  const loadPhotographyImages = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (hasFetched.current && photographyImages.length > 0) {
      console.log('📸 Already fetched, skipping...');
      return;
    }
    
    try {
      setPhotographyLoading(true);
      setError(null);
      console.log('📸 Fetching photography images...');
      const data = await getPhotographyImages();
      
      if (isMounted.current) {
        console.log('📸 Loaded photography images:', data);
        setPhotographyImages(data || []);
        hasFetched.current = true;
      }
    } catch (err) {
      console.error('❌ Load photography error:', err);
      if (isMounted.current) {
        setError(err.message || 'Failed to load photography images');
        toast.error('Failed to load photography images');
      }
    } finally {
      if (isMounted.current) {
        setPhotographyLoading(false);
      }
    }
  }, [toast, photographyImages.length]);

  // Add photography image from file
  const addPhotographyImage = useCallback(async (file, title) => {
    try {
      const loadingId = toast.loading('Uploading photography image...');
      console.log('📤 Starting upload:', { title, fileSize: file.size });
      
      const result = await uploadPhotographyImage(file, title);
      
      toast.dismissById(loadingId);
      
      if (result && result.id) {
        toast.success(`✅ "${title}" uploaded to Photography!`);
        // Reset fetch flag to allow refresh
        hasFetched.current = false;
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

  // Delete single photography image
  const removePhotographyImage = useCallback(async (id) => {
    try {
      await deleteImage(id);
      toast.success('✅ Photography image deleted successfully!');
      // Reset fetch flag to allow refresh
      hasFetched.current = false;
      await loadPhotographyImages();
      return { success: true };
    } catch (err) {
      console.error('❌ Delete photography error:', err);
      toast.error(err.message || 'Failed to delete photography image');
      return { success: false, error: err.message };
    }
  }, [loadPhotographyImages, toast]);

  // Delete all photography images
  const clearAllPhotographyImages = useCallback(async () => {
    try {
      await deleteAllImages();
      toast.success('✅ All photography images deleted successfully!');
      // Reset fetch flag to allow refresh
      hasFetched.current = false;
      await loadPhotographyImages();
      return { success: true };
    } catch (err) {
      console.error('❌ Clear all photography error:', err);
      toast.error(err.message || 'Failed to delete all photography images');
      return { success: false, error: err.message };
    }
  }, [loadPhotographyImages, toast]);

  // Load images on mount - ONLY ONCE
  useEffect(() => {
    // Reset fetch flag when component mounts
    hasFetched.current = false;
    loadPhotographyImages();
    
    // Cleanup
    return () => {
      isMounted.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - ONLY RUN ONCE

  return {
    photographyImages,
    photographyLoading,
    error,
    addPhotographyImage,
    removePhotographyImage,
    clearAllPhotographyImages,
    refresh: () => {
      hasFetched.current = false;
      loadPhotographyImages();
    }
  };
}

export default usePhotographyImages;