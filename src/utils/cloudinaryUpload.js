// // frontend/src/utils/cloudinaryUpload.js

// const CLOUDINARY_CLOUD_NAME = 'dj5limxeb'; // உங்கள் Cloudinary cloud name
// const UPLOAD_PRESET = 'photography_upload'; // Unsigned upload preset

// export const uploadToCloudinary = async (file, title) => {
//   try {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', UPLOAD_PRESET);
//     formData.append('folder', 'photography');
//     formData.append('public_id', title || Date.now().toString());

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: 'POST',
//         body: formData,
//       }
//     );

//     const data = await response.json();

//     if (data.secure_url) {
//       return {
//         success: true,
//         image: {
//           id: data.public_id,
//           url: data.secure_url,
//           title: title || 'Untitled',
//           cloudinary_id: data.public_id,
//           type: 'photography',
//           created_at: new Date().toISOString(),
//           createdAt: new Date().toISOString()
//         }
//       };
//     } else {
//       throw new Error(data.error?.message || 'Upload failed');
//     }
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw error;
//   }
// };
// frontend/src/utils/cloudinaryUpload.js

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dj5limxeb';
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET || 'photography_upload';

/**
 * Upload image directly to Cloudinary from frontend
 * @param {File} file - The image file
 * @param {string} title - Image title
 * @returns {Promise} - Cloudinary upload response
 */
export const uploadToCloudinary = async (file, title) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('public_id', title.replace(/\s+/g, '_').toLowerCase());
  formData.append('folder', 'photography');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(errorData.error?.message || 'Upload to Cloudinary failed');
    }

    const data = await response.json();
    console.log('✅ Cloudinary upload success:', data);
    return data;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};