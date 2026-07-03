// // // import React, { useState, useRef } from 'react';
// // // import { FaCloudUploadAlt, FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt } from 'react-icons/fa';
// // // import useToast from '../hooks/useToast';
// // // import './Admin.css';

// // // function Admin({ images, addImage, deleteImage }) {
// // //   const [newImageFile, setNewImageFile] = useState(null);
// // //   const [newImageTitle, setNewImageTitle] = useState('');
// // //   const [previewUrl, setPreviewUrl] = useState('');
// // //   const [isUploading, setIsUploading] = useState(false);
// // //   const fileInputRef = useRef(null);
// // //   const toast = useToast();

// // //   const handleFileChange = (e) => {
// // //     const file = e.target.files[0];
// // //     if (file) {
// // //       if (file.size > 10 * 1024 * 1024) {
// // //         toast.error('File size exceeds 10MB limit. Please choose a smaller image.');
// // //         e.target.value = '';
// // //         return;
// // //       }
      
// // //       setNewImageFile(file);
// // //       const reader = new FileReader();
// // //       reader.onloadend = () => {
// // //         setPreviewUrl(reader.result);
// // //       };
// // //       reader.readAsDataURL(file);
// // //     }
// // //   };

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
    
// // //     if (newImageFile && newImageTitle.trim()) {
// // //       setIsUploading(true);
      
// // //       const loadingId = toast.loading('Uploading image...');
      
// // //       const reader = new FileReader();
// // //       reader.onloadend = () => {
// // //         const imageData = reader.result;
// // //         addImage(imageData, newImageTitle.trim());
// // //         setIsUploading(false);
        
// // //         setNewImageFile(null);
// // //         setNewImageTitle('');
// // //         setPreviewUrl('');
// // //         if (fileInputRef.current) {
// // //           fileInputRef.current.value = '';
// // //         }
        
// // //         toast.dismissById(loadingId);
// // //         toast.success(`✅ "${newImageTitle.trim()}" added successfully!`);
// // //       };
// // //       reader.readAsDataURL(newImageFile);
// // //     } else {
// // //       toast.warning('Please select an image and enter a title');
// // //     }
// // //   };

// // //   const handleDelete = (id, title) => {
// // //     toast.dangerConfirm(
// // //       `Delete "${title}"?`,
// // //       () => {
// // //         deleteImage(id);
// // //         toast.success(`✅ "${title}" deleted successfully!`);
// // //       },
// // //       () => {
// // //         toast.info(`ℹ️ "${title}" was not deleted`);
// // //       }
// // //     );
// // //   };

// // //   const handleClearAll = () => {
// // //     if (images.length === 0) {
// // //       toast.info('No photos to delete');
// // //       return;
// // //     }
    
// // //     toast.dangerConfirm(
// // //       `Delete all ${images.length} photos?`,
// // //       () => {
// // //         images.forEach(img => deleteImage(img.id));
// // //         toast.success(`✅ All ${images.length} photos deleted successfully!`);
// // //       },
// // //       () => {
// // //         toast.info('ℹ️ No photos were deleted');
// // //       }
// // //     );
// // //   };

// // //   const handleLogout = () => {
// // //     toast.info('👋 Logging out...');
// // //     setTimeout(() => {
// // //       localStorage.removeItem('isAdminLoggedIn');
// // //       localStorage.removeItem('adminLoginTime');
// // //       window.location.reload();
// // //     }, 500);
// // //   };

// // //   const formatFileSize = (bytes) => {
// // //     if (bytes === 0) return '0 Bytes';
// // //     const k = 1024;
// // //     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// // //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// // //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// // //   };

// // //   return (
// // //     <section className="page">
// // //       <div className="admin-header">
// // //         <h2 className="page-title">Admin Panel</h2>
// // //         <button className="logout-btn" onClick={handleLogout}>
// // //           <FaSignOutAlt /> Logout
// // //         </button>
// // //       </div>

// // //       <div className="admin-card">
// // //         <h3>Add New Photo</h3>
// // //         <form onSubmit={handleSubmit} className="admin-form">
// // //           <div className="file-upload-container">
// // //             <input
// // //               type="file"
// // //               id="imageUpload"
// // //               accept="image/*"
// // //               onChange={handleFileChange}
// // //               ref={fileInputRef}
// // //               required
// // //               className="file-input"
// // //               disabled={isUploading}
// // //             />
// // //             <label htmlFor="imageUpload" className={`file-label ${isUploading ? 'disabled' : ''}`}>
// // //               <FaCloudUploadAlt />
// // //               {newImageFile ? newImageFile.name : 'Choose an image...'}
// // //               {newImageFile && (
// // //                 <span className="file-size">({formatFileSize(newImageFile.size)})</span>
// // //               )}
// // //             </label>
// // //           </div>
          
// // //           {previewUrl && (
// // //             <div className="image-preview">
// // //               <img src={previewUrl} alt="Preview" />
// // //             </div>
// // //           )}
          
// // //           <input
// // //             type="text"
// // //             placeholder="Image Title"
// // //             value={newImageTitle}
// // //             onChange={(e) => setNewImageTitle(e.target.value)}
// // //             required
// // //             disabled={isUploading}
// // //           />
          
// // //           <button 
// // //             type="submit" 
// // //             className="btn-primary"
// // //             disabled={isUploading}
// // //           >
// // //             {isUploading ? (
// // //               <>
// // //                 <span className="upload-spinner"></span>
// // //                 Uploading...
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <FaPlus /> Add Photo
// // //               </>
// // //             )}
// // //           </button>
// // //         </form>
        
// // //         <hr />
        
// // //         <div className="admin-stats">
// // //           <span>Total Photos: <strong>{images.length}</strong></span>
// // //           {images.length > 0 && (
// // //             <button className="btn-clear" onClick={handleClearAll}>
// // //               <FaTrashAlt /> Clear All
// // //             </button>
// // //           )}
// // //         </div>
        
// // //         <h4>Manage Existing Photos</h4>
// // //         <div className="admin-list">
// // //           {images.length === 0 ? (
// // //             <p className="empty-message">No photos in gallery. Upload your first image!</p>
// // //           ) : (
// // //             images.map(img => (
// // //               <div key={img.id} className="admin-list-item">
// // //                 <div className="admin-thumb">
// // //                   <img src={img.url} alt={img.title} />
// // //                 </div>
// // //                 <span className="admin-title">{img.title}</span>
// // //                 <span className="admin-date">
// // //                   {new Date(img.timestamp || Date.now()).toLocaleDateString()}
// // //                 </span>
// // //                 <button
// // //                   className="btn-danger"
// // //                   onClick={() => handleDelete(img.id, img.title)}
// // //                 >
// // //                   <FaTrash />
// // //                 </button>
// // //               </div>
// // //             ))
// // //           )}
// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // }

// // // export default Admin;



// // import React, { useState, useRef } from 'react';
// // import { FaCloudUploadAlt, FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt, FaLink } from 'react-icons/fa';
// // import useToast from '../hooks/useToast';
// // import './Admin.css';

// // function Admin({ images, addImageFromFile, addImageFromUrl, deleteImage }) {
// //   const [newImageFile, setNewImageFile] = useState(null);
// //   const [newImageTitle, setNewImageTitle] = useState('');
// //   const [previewUrl, setPreviewUrl] = useState('');
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [uploadType, setUploadType] = useState('file');
// //   const [imageUrl, setImageUrl] = useState('');
// //   const fileInputRef = useRef(null);
// //   const toast = useToast();

// //   const handleFileChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 10 * 1024 * 1024) {
// //         toast.error('File size exceeds 10MB limit.');
// //         e.target.value = '';
// //         return;
// //       }
      
// //       setNewImageFile(file);
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setPreviewUrl(reader.result);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleUrlChange = (e) => {
// //     const url = e.target.value;
// //     setImageUrl(url);
// //     if (url && isValidUrl(url)) {
// //       setPreviewUrl(url);
// //     } else {
// //       setPreviewUrl('');
// //     }
// //   };

// //   const isValidUrl = (string) => {
// //     try {
// //       new URL(string);
// //       return true;
// //     } catch (_) {
// //       return false;
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
    
// //     if (uploadType === 'file') {
// //       if (newImageFile && newImageTitle.trim()) {
// //         setIsUploading(true);
// //         try {
// //           await addImageFromFile(newImageFile, newImageTitle.trim());
// //           setNewImageFile(null);
// //           setNewImageTitle('');
// //           setPreviewUrl('');
// //           if (fileInputRef.current) {
// //             fileInputRef.current.value = '';
// //           }
// //         } catch (error) {
// //           console.error('Upload error:', error);
// //         } finally {
// //           setIsUploading(false);
// //         }
// //       } else {
// //         toast.warning('Please select an image and enter a title');
// //       }
// //     } else {
// //       if (imageUrl.trim() && newImageTitle.trim()) {
// //         if (isValidUrl(imageUrl)) {
// //           setIsUploading(true);
// //           try {
// //             await addImageFromUrl(imageUrl.trim(), newImageTitle.trim());
// //             setImageUrl('');
// //             setNewImageTitle('');
// //             setPreviewUrl('');
// //           } catch (error) {
// //             console.error('Upload error:', error);
// //           } finally {
// //             setIsUploading(false);
// //           }
// //         } else {
// //           toast.error('Please enter a valid URL');
// //         }
// //       } else {
// //         toast.warning('Please enter both URL and title');
// //       }
// //     }
// //   };

// //   const handleDelete = (id, title) => {
// //     toast.dangerConfirm(
// //       `Delete "${title}"?`,
// //       () => {
// //         deleteImage(id);
// //       },
// //       () => {
// //         toast.info(`ℹ️ "${title}" was not deleted`);
// //       }
// //     );
// //   };

// //   const handleClearAll = () => {
// //     if (images.length === 0) {
// //       toast.info('No photos to delete');
// //       return;
// //     }
    
// //     toast.dangerConfirm(
// //       `Delete all ${images.length} photos?`,
// //       () => {
// //         images.forEach(img => deleteImage(img.id));
// //       },
// //       () => {
// //         toast.info('ℹ️ No photos were deleted');
// //       }
// //     );
// //   };

// //   const handleLogout = () => {
// //     toast.info('👋 Logging out...');
// //     setTimeout(() => {
// //       localStorage.removeItem('isAdminLoggedIn');
// //       localStorage.removeItem('adminLoginTime');
// //       window.location.reload();
// //     }, 500);
// //   };

// //   const formatFileSize = (bytes) => {
// //     if (bytes === 0) return '0 Bytes';
// //     const k = 1024;
// //     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
// //     const i = Math.floor(Math.log(bytes) / Math.log(k));
// //     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
// //   };

// //   const sampleUrls = [
// //     'https://picsum.photos/id/1015/400/300',
// //     'https://picsum.photos/id/1016/400/300',
// //     'https://picsum.photos/id/1018/400/300',
// //   ];

// //   const fillSampleUrl = (url) => {
// //     setImageUrl(url);
// //     setPreviewUrl(url);
// //     setUploadType('url');
// //   };

// //   return (
// //     <section className="page">
// //       <div className="admin-header">
// //         <h2 className="page-title">Admin Panel</h2>
// //         <button className="logout-btn" onClick={handleLogout}>
// //           <FaSignOutAlt /> Logout
// //         </button>
// //       </div>

// //       <div className="admin-card">
// //         <h3>Add New Photo</h3>
        
// //         <div className="upload-type-toggle">
// //           <button 
// //             className={`toggle-btn ${uploadType === 'file' ? 'active' : ''}`}
// //             onClick={() => {
// //               setUploadType('file');
// //               setPreviewUrl('');
// //               setImageUrl('');
// //             }}
// //           >
// //             <FaCloudUploadAlt /> File Upload
// //           </button>
// //           <button 
// //             className={`toggle-btn ${uploadType === 'url' ? 'active' : ''}`}
// //             onClick={() => {
// //               setUploadType('url');
// //               setPreviewUrl('');
// //               setNewImageFile(null);
// //               if (fileInputRef.current) {
// //                 fileInputRef.current.value = '';
// //               }
// //             }}
// //           >
// //             <FaLink /> URL Upload
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="admin-form">
// //           {uploadType === 'file' ? (
// //             <div className="file-upload-container">
// //               <input
// //                 type="file"
// //                 id="imageUpload"
// //                 accept="image/*"
// //                 onChange={handleFileChange}
// //                 ref={fileInputRef}
// //                 required
// //                 className="file-input"
// //                 disabled={isUploading}
// //               />
// //               <label htmlFor="imageUpload" className={`file-label ${isUploading ? 'disabled' : ''}`}>
// //                 <FaCloudUploadAlt />
// //                 {newImageFile ? newImageFile.name : 'Choose an image...'}
// //                 {newImageFile && (
// //                   <span className="file-size">({formatFileSize(newImageFile.size)})</span>
// //                 )}
// //               </label>
// //             </div>
// //           ) : (
// //             <div className="url-upload-container">
// //               <input
// //                 type="url"
// //                 placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
// //                 value={imageUrl}
// //                 onChange={handleUrlChange}
// //                 required
// //                 disabled={isUploading}
// //                 className="url-input"
// //               />
// //               <div className="sample-urls">
// //                 <span className="sample-label">Quick add:</span>
// //                 {sampleUrls.map((url, index) => (
// //                   <button
// //                     key={index}
// //                     type="button"
// //                     className="sample-url-btn"
// //                     onClick={() => fillSampleUrl(url)}
// //                   >
// //                     Sample {index + 1}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>
// //           )}
          
// //           {previewUrl && (
// //             <div className="image-preview">
// //               <img src={previewUrl} alt="Preview" />
// //             </div>
// //           )}
          
// //           <input
// //             type="text"
// //             placeholder="Image Title"
// //             value={newImageTitle}
// //             onChange={(e) => setNewImageTitle(e.target.value)}
// //             required
// //             disabled={isUploading}
// //           />
          
// //           <button 
// //             type="submit" 
// //             className="btn-primary"
// //             disabled={isUploading}
// //           >
// //             {isUploading ? (
// //               <>
// //                 <span className="upload-spinner"></span>
// //                 Uploading...
// //               </>
// //             ) : (
// //               <>
// //                 <FaPlus /> Add Photo
// //               </>
// //             )}
// //           </button>
// //         </form>
        
// //         <hr />
        
// //         <div className="admin-stats">
// //           <span>Total Photos: <strong>{images.length}</strong></span>
// //           {images.length > 0 && (
// //             <button className="btn-clear" onClick={handleClearAll}>
// //               <FaTrashAlt /> Clear All
// //             </button>
// //           )}
// //         </div>
        
// //         <h4>Manage Existing Photos</h4>
// //         <div className="admin-list">
// //           {images.length === 0 ? (
// //             <p className="empty-message">No photos in gallery. Upload your first image!</p>
// //           ) : (
// //             images.map(img => (
// //               <div key={img.id} className="admin-list-item">
// //                 <div className="admin-thumb">
// //                   <img src={img.url} alt={img.title} />
// //                 </div>
// //                 <span className="admin-title">{img.title}</span>
// //                 <span className="admin-date">
// //                   {new Date(img.created_at || Date.now()).toLocaleDateString()}
// //                 </span>
// //                 <button
// //                   className="btn-danger"
// //                   onClick={() => handleDelete(img.id, img.title)}
// //                 >
// //                   <FaTrash />
// //                 </button>
// //               </div>
// //             ))
// //           )}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // export default Admin;

// import React, { useState } from 'react';
// import { FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt, FaLink } from 'react-icons/fa';
// import useToast from '../hooks/useToast';
// import './Admin.css';

// function Admin({ images, addImageFromUrl, deleteImage }) {
//   const [imageUrl, setImageUrl] = useState('');
//   const [newImageTitle, setNewImageTitle] = useState('');
//   const [previewUrl, setPreviewUrl] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const toast = useToast();

//   const handleUrlChange = (e) => {
//     const url = e.target.value;
//     setImageUrl(url);
//     if (url && isValidUrl(url)) {
//       setPreviewUrl(url);
//     } else {
//       setPreviewUrl('');
//     }
//   };

//   const isValidUrl = (string) => {
//     try {
//       new URL(string);
//       return true;
//     } catch (_) {
//       return false;
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (imageUrl.trim() && newImageTitle.trim()) {
//       if (isValidUrl(imageUrl)) {
//         setIsUploading(true);
//         try {
//           await addImageFromUrl(imageUrl.trim(), newImageTitle.trim());
//           setImageUrl('');
//           setNewImageTitle('');
//           setPreviewUrl('');
//           toast.success('✅ Image added successfully!');
//         } catch (error) {
//           console.error('Upload error:', error);
//           toast.error('Failed to add image');
//         } finally {
//           setIsUploading(false);
//         }
//       } else {
//         toast.error('Please enter a valid URL');
//       }
//     } else {
//       toast.warning('Please enter both URL and title');
//     }
//   };

//   const handleDelete = (id, title) => {
//     toast.dangerConfirm(
//       `Delete "${title}"?`,
//       () => {
//         deleteImage(id);
//       },
//       () => {
//         toast.info(`ℹ️ "${title}" was not deleted`);
//       }
//     );
//   };

//   const handleClearAll = () => {
//     if (images.length === 0) {
//       toast.info('No photos to delete');
//       return;
//     }
    
//     toast.dangerConfirm(
//       `Delete all ${images.length} photos?`,
//       () => {
//         images.forEach(img => deleteImage(img.id));
//       },
//       () => {
//         toast.info('ℹ️ No photos were deleted');
//       }
//     );
//   };

//   const handleLogout = () => {
//     toast.info('👋 Logging out...');
//     setTimeout(() => {
//       localStorage.removeItem('isAdminLoggedIn');
//       localStorage.removeItem('adminLoginTime');
//       window.location.reload();
//     }, 500);
//   };

//   const sampleUrls = [
//     'https://res.cloudinary.com/dj5limxeb/image/upload/v1782916298/Mother_a3sahc.jpg',
//     'https://picsum.photos/id/1015/400/300',
//     'https://picsum.photos/id/1016/400/300',
//     'https://picsum.photos/id/1018/400/300',
//   ];

//   const fillSampleUrl = (url) => {
//     setImageUrl(url);
//     setPreviewUrl(url);
//   };

//   return (
//     <section className="page">
//       <div className="admin-header">
//         <h2 className="page-title">Admin Panel</h2>
//         <button className="logout-btn" onClick={handleLogout}>
//           <FaSignOutAlt /> Logout
//         </button>
//       </div>

//       <div className="admin-card">
//         <h3>Add New Photo via URL</h3>
        
//         <form onSubmit={handleSubmit} className="admin-form">
//           <div className="url-upload-container">
//             <input
//               type="url"
//               placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
//               value={imageUrl}
//               onChange={handleUrlChange}
//               required
//               disabled={isUploading}
//               className="url-input"
//             />
//             <div className="sample-urls">
//               <span className="sample-label">Quick add:</span>
//               {sampleUrls.map((url, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   className="sample-url-btn"
//                   onClick={() => fillSampleUrl(url)}
//                 >
//                   Sample {index + 1}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {previewUrl && (
//             <div className="image-preview">
//               <img src={previewUrl} alt="Preview" />
//             </div>
//           )}
          
//           <input
//             type="text"
//             placeholder="Image Title"
//             value={newImageTitle}
//             onChange={(e) => setNewImageTitle(e.target.value)}
//             required
//             disabled={isUploading}
//           />
          
//           <button 
//             type="submit" 
//             className="btn-primary"
//             disabled={isUploading}
//           >
//             {isUploading ? (
//               <>
//                 <span className="upload-spinner"></span>
//                 Adding...
//               </>
//             ) : (
//               <>
//                 <FaLink /> Add Photo from URL
//               </>
//             )}
//           </button>
//         </form>
        
//         <hr />
        
//         <div className="admin-stats">
//           <span>Total Photos: <strong>{images.length}</strong></span>
//           {images.length > 0 && (
//             <button className="btn-clear" onClick={handleClearAll}>
//               <FaTrashAlt /> Clear All
//             </button>
//           )}
//         </div>
        
//         <h4>Manage Existing Photos</h4>
//         <div className="admin-list">
//           {images.length === 0 ? (
//             <p className="empty-message">No photos in gallery. Add your first image!</p>
//           ) : (
//             images.map(img => (
//               <div key={img.id} className="admin-list-item">
//                 <div className="admin-thumb">
//                   <img src={img.url} alt={img.title} />
//                 </div>
//                 <span className="admin-title">{img.title}</span>
//                 <span className="admin-date">
//                   {new Date(img.created_at || Date.now()).toLocaleDateString()}
//                 </span>
//                 <button
//                   className="btn-danger"
//                   onClick={() => handleDelete(img.id, img.title)}
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Admin;

import React, { useState } from 'react';
import { FaPlus, FaTrash, FaTrashAlt, FaSignOutAlt, FaLink } from 'react-icons/fa';
import useToast from '../hooks/useToast';
import './Admin.css';

function Admin({ images, addImageFromUrl, deleteImage }) {
  const [imageUrl, setImageUrl] = useState('');
  const [newImageTitle, setNewImageTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url && isValidUrl(url)) {
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageUrl.trim() && newImageTitle.trim()) {
      if (isValidUrl(imageUrl)) {
        setIsUploading(true);
        try {
          await addImageFromUrl(imageUrl.trim(), newImageTitle.trim());
          setImageUrl('');
          setNewImageTitle('');
          setPreviewUrl('');
          toast.success('✅ Image added successfully!');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(error.message || 'Failed to add image');
        } finally {
          setIsUploading(false);
        }
      } else {
        toast.error('Please enter a valid URL');
      }
    } else {
      toast.warning('Please enter both URL and title');
    }
  };

  const handleDelete = (id, title) => {
    toast.dangerConfirm(
      `Delete "${title}"?`,
      () => {
        deleteImage(id);
        toast.success(`✅ "${title}" deleted successfully!`);
      },
      () => {
        toast.info(`ℹ️ "${title}" was not deleted`);
      }
    );
  };

  const handleClearAll = () => {
    if (images.length === 0) {
      toast.info('No photos to delete');
      return;
    }
    
    toast.dangerConfirm(
      `Delete all ${images.length} photos?`,
      () => {
        images.forEach(img => deleteImage(img.id));
        toast.success(`✅ All ${images.length} photos deleted successfully!`);
      },
      () => {
        toast.info('ℹ️ No photos were deleted');
      }
    );
  };

const handleLogout = () => {
  toast.info('👋 Logging out...');

  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('adminLoginTime');

  setTimeout(() => {
    window.location.href = '/';
  }, 500);
};

  // Working sample URLs (these are guaranteed to work)
  const sampleUrls = [
    'https://picsum.photos/seed/1/800/600',
    'https://picsum.photos/seed/2/800/600',
    'https://picsum.photos/seed/3/800/600',
    'https://picsum.photos/seed/4/800/600',
  ];

  const fillSampleUrl = (url) => {
    setImageUrl(url);
    setPreviewUrl(url);
  };

  // Helper to get image URL (handles both url and imageUrl)
  const getImageUrl = (image) => {
    return image?.url || image?.imageUrl || '';
  };

  return (
    <section className="page">
      <div className="admin-header">
        <h2 className="page-title">Admin Panel</h2>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="admin-card">
        <h3>Add New Photo via URL</h3>
        
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="url-upload-container">
            <input
              type="url"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              value={imageUrl}
              onChange={handleUrlChange}
              required
              disabled={isUploading}
              className="url-input"
            />
            <div className="sample-urls">
              <span className="sample-label">Quick add (working URLs):</span>
              {sampleUrls.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  className="sample-url-btn"
                  onClick={() => fillSampleUrl(url)}
                >
                  Sample {index + 1}
                </button>
              ))}
            </div>
            <div className="url-hint">
              <p>💡 Tip: Use Picsum URLs for testing: https://picsum.photos/seed/1/800/600</p>
            </div>
          </div>
          
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
          
          <input
            type="text"
            placeholder="Image Title"
            value={newImageTitle}
            onChange={(e) => setNewImageTitle(e.target.value)}
            required
            disabled={isUploading}
          />
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <span className="upload-spinner"></span>
                Adding...
              </>
            ) : (
              <>
                <FaLink /> Add Photo from URL
              </>
            )}
          </button>
        </form>
        
        <hr />
        
        <div className="admin-stats">
          <span>Total Photos: <strong>{images.length}</strong></span>
          {images.length > 0 && (
            <button className="btn-clear" onClick={handleClearAll}>
              <FaTrashAlt /> Clear All
            </button>
          )}
        </div>
        
        <h4>Manage Existing Photos</h4>
        <div className="admin-list">
          {images.length === 0 ? (
            <p className="empty-message">No photos in gallery. Add your first image!</p>
          ) : (
            images.map(img => (
              <div key={img.id} className="admin-list-item">
                <div className="admin-thumb">
                  <img 
                    src={getImageUrl(img)} 
                    alt={img.title}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/60x60/1c1c1c/c9ad93?text=Error';
                    }}
                  />
                </div>
                <span className="admin-title">{img.title}</span>
                <span className="admin-date">
                  {new Date(img.created_at || img.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(img.id, img.title)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Admin;
