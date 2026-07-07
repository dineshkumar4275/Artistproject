// frontend/src/utils/cloudinaryUpload.js

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dj5limxeb';
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET || 'photography_upload';

console.log('📸 Cloudinary Config:', {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET
});

/**
 * Upload image directly to Cloudinary from frontend
 * @param {File} file - The image file
 * @param {string} title - Image title
 * @param {Function} onProgress - Progress callback (optional)
 * @returns {Promise} - Cloudinary upload response
 */
export const uploadToCloudinary = async (file, title, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'photography');
    formData.append('public_id', title.replace(/\s+/g, '_').toLowerCase());

    const xhr = new XMLHttpRequest();
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    console.log('📤 Uploading to Cloudinary...');
    console.log('📤 Upload Preset:', UPLOAD_PRESET);
    
    xhr.open('POST', url);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      };
    }

    xhr.onload = () => {
      console.log('📊 Response status:', xhr.status);
      
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log('✅ Cloudinary upload success:', data.public_id);
          resolve(data);
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        let errorMessage = 'Upload failed';
        try {
          const errorData = JSON.parse(xhr.responseText);
          errorMessage = errorData.error?.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = xhr.responseText || errorMessage;
        }
        console.error('❌ Cloudinary upload error:', errorMessage);
        reject(new Error(errorMessage));
      }
    };

    xhr.onerror = () => {
      console.error('❌ Network error during upload');
      reject(new Error('Network error during upload'));
    };

    xhr.send(formData);
  });
};

/**
 * Upload image using fetch API (simpler version)
 */
export const uploadToCloudinaryFetch = async (file, title) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'photography');
  formData.append('public_id', title.replace(/\s+/g, '_').toLowerCase());

  try {
    console.log('📤 Uploading with preset:', UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const responseText = await response.text();
    console.log('📊 Response status:', response.status);
    console.log('📊 Response:', responseText);

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    console.log('✅ Upload success:', data.public_id);
    return data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

export default uploadToCloudinary;