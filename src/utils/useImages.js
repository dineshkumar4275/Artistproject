import { useState, useEffect } from 'react';
import { getImages, uploadImageFile, uploadImageByUrl, deleteImage, deleteAllImages } from '../services/api';
import useToast from '../hooks/useToast';

function useImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  // Load images from backend
  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load images');
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Add image from file
  const addImageFromFile = async (file, title) => {
    try {
      const loadingId = toast.loading('Uploading image...');
      const result = await uploadImageFile(file, title);
      toast.dismissById(loadingId);
      toast.success(`✅ "${title}" uploaded successfully!`);
      await loadImages(); // Refresh images
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
      throw err;
    }
  };

  // Add image from URL
  const addImageFromUrl = async (imageUrl, title) => {
    try {
      const loadingId = toast.loading('Adding image from URL...');
      const result = await uploadImageByUrl(imageUrl, title);
      toast.dismissById(loadingId);
      toast.success(`✅ "${title}" added successfully!`);
      await loadImages(); // Refresh images
      return result;
    } catch (err) {
      toast.error(err.message || 'Failed to add image');
      throw err;
    }
  };

  // Delete single image
  const removeImage = async (id) => {
    try {
      await deleteImage(id);
      toast.success('✅ Image deleted successfully!');
      await loadImages(); // Refresh images
    } catch (err) {
      toast.error(err.message || 'Failed to delete image');
      throw err;
    }
  };

  // Delete all images
  const clearAllImages = async () => {
    try {
      await deleteAllImages();
      toast.success('✅ All images deleted successfully!');
      await loadImages(); // Refresh images
    } catch (err) {
      toast.error(err.message || 'Failed to delete all images');
      throw err;
    }
  };

  // Load images on mount
  useEffect(() => {
    loadImages();
  }, []);

  return {
    images,
    loading,
    error,
    addImageFromFile,
    addImageFromUrl,
    removeImage,
    clearAllImages,
    refresh: loadImages
  };
}

export default useImages;