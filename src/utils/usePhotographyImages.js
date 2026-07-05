// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect } from 'react';
import { getPhotographyImages, uploadPhotographyImage, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Load photography images from backend
  const loadPhotographyImages = async () => {
    try {
      setPhotographyLoading(true);
      const data = await getPhotographyImages();
      setPhotographyImages(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load photography images');
      toast.error('Failed to load photography images');
    } finally {
      setPhotographyLoading(false);
    }
  };

  // Add photography image from file
  const addPhotographyImage = async (file, title) => {
    try {
      const loadingId = toast.loading('Uploading photography image...');
      const result = await uploadPhotographyImage(file, title);
      toast.dismissById(loadingId);
      toast.success(`✅ "${title}" uploaded to photography!`);
      await loadPhotographyImages(); // Refresh images
      return { success: true, data: result };
    } catch (err) {
      toast.error(err.message || 'Failed to upload photography image');
      return { success: false, error: err.message };
    }
  };

  // Delete single photography image
  const removePhotographyImage = async (id) => {
    try {
      await deleteImage(id);
      toast.success('✅ Photography image deleted successfully!');
      await loadPhotographyImages(); // Refresh images
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete photography image');
      return { success: false, error: err.message };
    }
  };

  // Delete all photography images
  const clearAllPhotographyImages = async () => {
    try {
      await deleteAllImages();
      toast.success('✅ All photography images deleted successfully!');
      await loadPhotographyImages(); // Refresh images
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete all photography images');
      return { success: false, error: err.message };
    }
  };

  // Load images on mount
  useEffect(() => {
    loadPhotographyImages();
  }, []);

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

export default usePhotographyImages;// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect } from 'react';
import { getPhotographyImages, uploadPhotographyImage, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Load photography images from backend
  const loadPhotographyImages = async () => {
    try {
      setPhotographyLoading(true);
      const data = await getPhotographyImages();
      setPhotographyImages(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load photography images');
      toast.error('Failed to load photography images');
    } finally {
      setPhotographyLoading(false);
    }
  };

  // Add photography image from file
  const addPhotographyImage = async (file, title) => {
    try {
      const loadingId = toast.loading('Uploading photography image...');
      const result = await uploadPhotographyImage(file, title);
      toast.dismissById(loadingId);
      toast.success(`✅ "${title}" uploaded to photography!`);
      await loadPhotographyImages(); // Refresh images
      return { success: true, data: result };
    } catch (err) {
      toast.error(err.message || 'Failed to upload photography image');
      return { success: false, error: err.message };
    }
  };

  // Delete single photography image
  const removePhotographyImage = async (id) => {
    try {
      await deleteImage(id);
      toast.success('✅ Photography image deleted successfully!');
      await loadPhotographyImages(); // Refresh images
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete photography image');
      return { success: false, error: err.message };
    }
  };

  // Delete all photography images
  const clearAllPhotographyImages = async () => {
    try {
      await deleteAllImages();
      toast.success('✅ All photography images deleted successfully!');
      await loadPhotographyImages(); // Refresh images
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete all photography images');
      return { success: false, error: err.message };
    }
  };

  // Load images on mount
  useEffect(() => {
    loadPhotographyImages();
  }, []);

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

export default usePhotographyImages;// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect } from 'react';
import { getPhotographyImages, uploadPhotographyImage, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Load photography images from backend
  const loadPhotographyImages = async () => {
    try {
      setPhotographyLoading(true);
      const data = await getPhotographyImages();
      setPhotographyImages(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load photography images');
      toast.error('Failed to load photography images');
    } finally {
      setPhotographyLoading(false);
    }
  };

  // Add photography image from file
  const addPhotographyImage = async (file, title) => {
    try {
      const loadingId = toast.loading('Uploading photography image...');
      const result = await uploadPhotographyImage(file, title);
      toast.dismissById(loadingId);
      toast.success(`✅ "${title}" uploaded to photography!`);
      await loadPhotographyImages(); // Refresh images
      return { success: true, data: result };
    } catch (err) {
      toast.error(err.message || 'Failed to upload photography image');
      return { success: false, error: err.message };
    }
  };

  // Delete single photography image
  const removePhotographyImage = async (id) => {
    try {
      await deleteImage(id);
      toast.success('✅ Photography image deleted successfully!');
      await loadPhotographyImages(); // Refresh images
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete photography image');
      return { success: false, error: err.message };
    }
  };

  // Delete all photography images
  const clearAllPhotographyImages = async () => {
    try {
      await deleteAllImages();
      toast.success('✅ All photography images deleted successfully!');
      await loadPhotographyImages(); // Refresh images
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete all photography images');
      return { success: false, error: err.message };
    }
  };

  // Load images on mount
  useEffect(() => {
    loadPhotographyImages();
  }, []);

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