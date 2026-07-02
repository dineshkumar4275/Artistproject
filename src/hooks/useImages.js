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
      console.log('Raw data from API:', data);
      
      if (!Array.isArray(data)) {
        console.error('API did not return an array:', data);
        setImages([]);
        return;
      }
      
      // Format the data - handle both 'url' and 'imageUrl'
      const formattedData = data.map(item => ({
        id: item.id,
        title: item.title || 'Untitled',
        url: item.url || item.imageUrl || '', // Use url or imageUrl
        imageUrl: item.imageUrl || item.url || '', // Keep both
        cloudinary_id: item.cloudinary_id,
        created_at: item.created_at || item.createdAt || new Date().toISOString()
      }));
      
      console.log('Formatted data:', formattedData);
      setImages(formattedData);
      setError(null);
    } catch (err) {
      console.error('Load error:', err);
      setError(err.message || 'Failed to load images');
      showToast.error('Failed to load images');
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const addImageFromFile = async (file, title) => {
    try {
      const loadingId = showToast.loading('Uploading image...');
      const result = await uploadImageFile(file, title);
      showToast.dismissById(loadingId);
      showToast.success(`✅ "${title}" uploaded successfully!`);
      await loadImages();
      return result;
    } catch (err) {
      showToast.error(err.message || 'Failed to upload image');
      throw err;
    }
  };

  const addImageFromUrl = async (imageUrl, title) => {
    try {
      const loadingId = showToast.loading('Adding image from URL...');
      const result = await uploadImageByUrl(imageUrl, title);
      showToast.dismissById(loadingId);
      showToast.success(`✅ "${title}" added successfully!`);
      await loadImages();
      return result;
    } catch (err) {
      showToast.error(err.message || 'Failed to add image');
      throw err;
    }
  };

  const removeImage = async (id) => {
    try {
      await deleteImage(id);
      showToast.success('✅ Image deleted successfully!');
      await loadImages();
    } catch (err) {
      showToast.error(err.message || 'Failed to delete image');
      throw err;
    }
  };

  const clearAllImages = async () => {
    try {
      await deleteAllImages();
      showToast.success('✅ All images deleted successfully!');
      await loadImages();
    } catch (err) {
      showToast.error(err.message || 'Failed to delete all images');
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