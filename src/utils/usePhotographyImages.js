// frontend/src/utils/usePhotographyImages.js
import { useState, useEffect } from 'react';
import { uploadToCloudinary } from './cloudinaryUpload';

// Note: No localStorage - everything goes to Cloudinary
function usePhotographyImages() {
  const [photographyImages, setPhotographyImages] = useState([]);
  const [photographyLoading, setPhotographyLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load from Cloudinary - You need an API endpoint to fetch
  // For now, we'll maintain state only
  useEffect(() => {
    // If you have a backend API to fetch Cloudinary images
    // const fetchFromCloudinary = async () => {
    //   const response = await fetch('/api/images/photography');
    //   const data = await response.json();
    //   setPhotographyImages(data);
    // };
    // fetchFromCloudinary();
    
    setPhotographyLoading(false);
  }, []);

  // Add image - Direct Cloudinary Upload (No Local Storage)
  const addPhotographyImage = async (file, title) => {
    try {
      const result = await uploadToCloudinary(file, title);
      if (result.success) {
        // Add to state only - not localStorage
        setPhotographyImages(prev => [result.image, ...prev]);
        return result;
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Delete from Cloudinary - Needs backend API
  const removePhotographyImage = async (publicId) => {
    try {
      // Call your backend to delete from Cloudinary
      const response = await fetch(`/api/images/${publicId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setPhotographyImages(prev => prev.filter(img => img.id !== publicId));
      }
      return data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const clearAllPhotographyImages = async () => {
    try {
      // Delete all from Cloudinary
      const response = await fetch('/api/images', {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setPhotographyImages([]);
      }
      return data;
    } catch (error) {
      console.error('Clear all error:', error);
      throw error;
    }
  };

  return {
    photographyImages,
    photographyLoading,
    error,
    addPhotographyImage,
    removePhotographyImage,
    clearAllPhotographyImages
  };
}

export default usePhotographyImages;