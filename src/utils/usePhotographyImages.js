// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { getPhotographyImages, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://artistproject-backend.vercel.app/api';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  const loadPhotographyImages = useCallback(async () => {
    if (hasFetched.current && photographyImages.length > 0) {
      console.log('📸 Already fetched, skipping...');
      return;
    }
    
    try {
      setPhotographyLoading(true);
      setError(null);
      console.log('📸 Fetching photography images...');
      const data = await getPhotographyImages();
      
      console.log('📸 Raw data from API:', data);
      
      // ✅ Fix: Convert relative URLs to full URLs
      const fixedData = data.map(img => {
        // If URL is empty or undefined, try to construct it
        let imageUrl = img.url || img.imageUrl || '';
        
        if (imageUrl && imageUrl.startsWith('/api/')) {
          imageUrl = `${API_BASE_URL}${imageUrl}`;
        }
        
        // If no URL but we have an ID, construct the URL
        if (!imageUrl && img.id) {
          imageUrl = `${API_BASE_URL}/images/photography/image/${img.id}`;
        }
        
        console.log(`🔍 Image ${img.id}: ${img.title} → ${imageUrl}`);
        
        return {
          ...img,
          url: imageUrl,
          imageUrl: imageUrl
        };
      });
      
      if (isMounted.current) {
        console.log('📸 Final photography images:', fixedData);
        setPhotographyImages(fixedData || []);
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
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('description', '');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/images/photography/neon-upload`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : undefined
        },
        body: formData
      });
      
      const result = await response.json();
      console.log('📊 Upload response:', result);
      
      toast.dismissById(loadingId);
      
      if (result && result.id) {
        toast.success(`✅ "${title}" uploaded to Photography!`);
        hasFetched.current = false;
        await loadPhotographyImages();
        return { success: true, data: result };
      } else {
        toast.error(result.error || 'Upload failed - no response');
        return { success: false, error: result.error || 'Upload failed - no response' };
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
      hasFetched.current = false;
      await loadPhotographyImages();
      return { success: true };
    } catch (err) {
      console.error('❌ Clear all photography error:', err);
      toast.error(err.message || 'Failed to delete all photography images');
      return { success: false, error: err.message };
    }
  }, [loadPhotographyImages, toast]);

  useEffect(() => {
    hasFetched.current = false;
    loadPhotographyImages();
    return () => {
      isMounted.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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