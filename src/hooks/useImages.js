import { useState, useEffect } from 'react';
import { getImages, uploadImageFile, uploadImageByUrl, deleteImage, deleteAllImages } from '../services/api';
import showToast from '../utils/toastConfig';

function useImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getImages();
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled',
        url: item.url || item.imageUrl || '',
        imageUrl: item.imageUrl || item.url || '',
        cloudinary_id: item.cloudinary_id,
        created_at: item.created_at || item.createdAt || new Date().toISOString()
      }));
      setImages(formattedData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load images');
      if (showToast && showToast.error) {
        showToast.error('Failed to load images');
      }
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const addImageFromFile = async (file, title) => {
    try {
      let loadingId = null;
      if (showToast && showToast.loading) {
        loadingId = showToast.loading('Uploading image...');
      }
      const result = await uploadImageFile(file, title);
      if (loadingId && showToast && showToast.dismissById) {
        showToast.dismissById(loadingId);
      }
      if (showToast && showToast.success) {
        showToast.success(`✅ "${title}" uploaded successfully!`);
      }
      await loadImages();
      return result;
    } catch (err) {
      if (showToast && showToast.error) {
        showToast.error(err.message || 'Failed to upload image');
      }
      throw err;
    }
  };

  const addImageFromUrl = async (imageUrl, title) => {
    try {
      let loadingId = null;
      if (showToast && showToast.loading) {
        loadingId = showToast.loading('Adding image from URL...');
      }
      const result = await uploadImageByUrl(imageUrl, title);
      if (loadingId && showToast && showToast.dismissById) {
        showToast.dismissById(loadingId);
      }
      if (showToast && showToast.success) {
        showToast.success(`✅ "${title}" added successfully!`);
      }
      await loadImages();
      return result;
    } catch (err) {
      if (showToast && showToast.error) {
        showToast.error(err.message || 'Failed to add image');
      }
      throw err;
    }
  };

  const removeImage = async (id) => {
    try {
      await deleteImage(id);
      if (showToast && showToast.success) {
        showToast.success('✅ Image deleted successfully!');
      }
      await loadImages();
    } catch (err) {
      if (showToast && showToast.error) {
        showToast.error(err.message || 'Failed to delete image');
      }
      throw err;
    }
  };

  const clearAllImages = async () => {
    try {
      await deleteAllImages();
      if (showToast && showToast.success) {
        showToast.success('✅ All images deleted successfully!');
      }
      await loadImages();
    } catch (err) {
      if (showToast && showToast.error) {
        showToast.error(err.message || 'Failed to delete all images');
      }
      throw err;
    }
  };

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