// frontend/src/utils/cloudinaryUpload.js

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dj5limxeb';
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET || 'photography_upload';

console.log('📸 Cloudinary Config:', {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET
});

export const uploadToCloudinary = async (file, title) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'photography');
    
    // ✅ Use a clean public_id
    const cleanTitle = title.replace(/\s+/g, '_').toLowerCase();
    formData.append('public_id', cleanTitle);
    formData.append('overwrite', 'true'); // ✅ Overwrite if exists

    const xhr = new XMLHttpRequest();
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    
    console.log('📤 Uploading to Cloudinary...');
    console.log('📤 Upload Preset:', UPLOAD_PRESET);
    console.log('📤 Public ID:', cleanTitle);
    
    xhr.open('POST', url);

    xhr.onload = () => {
      console.log('📊 Response status:', xhr.status);
      
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          console.log('✅ Cloudinary upload success:', data.public_id);
          console.log('✅ Image URL:', data.secure_url);
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

export default uploadToCloudinary;