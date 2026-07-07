// frontend/src/utils/cloudinaryUpload.js

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dj5limxeb';
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET || 'photography_upload';

console.log('📸 Cloudinary Config:', {
  cloudName: CLOUDINARY_CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET
});

// List of presets to try (in order)
const PRESETS_TO_TRY = [
  UPLOAD_PRESET,
  'photography_upload',
  'unsigned_upload',
  'default',
  'my_upload_preset'
];

export const uploadToCloudinary = async (file, title, onProgress) => {
  let lastError = null;

  for (const preset of PRESETS_TO_TRY) {
    try {
      console.log(`📤 Trying preset: "${preset}"`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', preset);
      formData.append('folder', 'photography');
      formData.append('public_id', title.replace(/\s+/g, '_').toLowerCase());

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const responseText = await response.text();
      console.log(`📊 Preset "${preset}" response:`, response.status);

      if (response.ok) {
        console.log(`✅ Upload successful with preset: "${preset}"`);
        const data = JSON.parse(responseText);
        return data;
      }

      let errorMsg = `Preset "${preset}" failed`;
      try {
        const errorData = JSON.parse(responseText);
        errorMsg = errorData.error?.message || errorData.error || errorMsg;
      } catch (e) {
        errorMsg = responseText || errorMsg;
      }
      
      console.log(`❌ Preset "${preset}" failed:`, errorMsg);
      lastError = errorMsg;

      // If error is "Upload preset not found", try next preset
      if (errorMsg.includes('Upload preset not found')) {
        continue;
      }

      // Other errors - stop trying
      throw new Error(errorMsg);
      
    } catch (error) {
      console.log(`❌ Preset "${preset}" error:`, error.message);
      lastError = error.message;
      
      // If it's a network error, stop trying
      if (error.message.includes('Network') || error.message.includes('fetch')) {
        throw error;
      }
    }
  }

  throw new Error(`All upload presets failed. Last error: ${lastError}. Please create an upload preset named "photography_upload" in Cloudinary.`);
};

export default uploadToCloudinary;