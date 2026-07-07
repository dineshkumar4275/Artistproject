// // frontend/src/utils/imageCompressor.js
// export const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       const img = new Image();
//       img.src = event.target.result;
//       img.onload = () => {
//         const canvas = document.createElement('canvas');
//         let width = img.width;
//         let height = img.height;

//         // Resize if needed
//         if (width > maxWidth) {
//           height = (height * maxWidth) / width;
//           width = maxWidth;
//         }
//         if (height > maxHeight) {
//           width = (width * maxHeight) / height;
//           height = maxHeight;
//         }

//         canvas.width = width;
//         canvas.height = height;
//         const ctx = canvas.getContext('2d');
//         ctx.imageSmoothingEnabled = true;
//         ctx.imageSmoothingQuality = 'high';
//         ctx.drawImage(img, 0, 0, width, height);

//         // Convert to JPEG with quality
//         canvas.toBlob(
//           (blob) => {
//             if (blob) {
//               const compressedFile = new File([blob], file.name, {
//                 type: 'image/jpeg',
//                 lastModified: Date.now()
//               });
//               resolve(compressedFile);
//             } else {
//               reject(new Error('Failed to compress image'));
//             }
//           },
//           'image/jpeg',
//           quality
//         );
//       };
//       img.onerror = reject;
//     };
//     reader.onerror = reject;
//   });
// };

// frontend/src/utils/imageCompressor.js

/**
 * Compress image before upload
 * @param {File} file - The image file
 * @param {number} maxWidth - Maximum width (default: 1200)
 * @param {number} maxHeight - Maximum height (default: 1200)
 * @param {number} quality - JPEG quality (0.1 - 1.0, default: 0.85)
 * @param {number} maxSizeMB - Maximum file size in MB (default: 8)
 * @returns {Promise<File>} - Compressed file
 */
export const compressImage = async (
  file,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.85,
  maxSizeMB = 8
) => {
  return new Promise((resolve, reject) => {
    // If file is already small enough, return it
    if (file.size / (1024 * 1024) <= maxSizeMB) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try with different qualities until under maxSizeMB
        let currentQuality = quality;
        let blob = null;
        let attempts = 0;
        const maxAttempts = 5;

        const tryCompress = () => {
          canvas.toBlob(
            (resultBlob) => {
              if (resultBlob) {
                const sizeMB = resultBlob.size / (1024 * 1024);
                console.log(`📊 Attempt ${attempts + 1}: ${sizeMB.toFixed(2)}MB at quality ${currentQuality}`);
                
                if (sizeMB <= maxSizeMB || attempts >= maxAttempts) {
                  // Create file from blob
                  const compressedFile = new File(
                    [resultBlob],
                    file.name.replace(/\.[^/.]+$/, '.jpg'),
                    {
                      type: 'image/jpeg',
                      lastModified: Date.now()
                    }
                  );
                  console.log(`✅ Compressed: ${(file.size / (1024 * 1024)).toFixed(2)}MB → ${sizeMB.toFixed(2)}MB`);
                  resolve(compressedFile);
                } else {
                  // Reduce quality and try again
                  attempts++;
                  currentQuality = currentQuality - 0.1;
                  if (currentQuality < 0.3) currentQuality = 0.3;
                  tryCompress();
                }
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            currentQuality
          );
        };

        tryCompress();
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Check if file is an image
 */
export const isImageFile = (file) => {
  return file.type.startsWith('image/');
};

/**
 * Get file size in MB
 */
export const getFileSizeMB = (file) => {
  return file.size / (1024 * 1024);
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};