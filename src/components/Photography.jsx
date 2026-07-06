// frontend/src/components/Photography.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import './Photography.css';

function Photography({ images }) {
  const [loadingImages, setLoadingImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const modalRef = useRef(null);

  // Group images into rows of 2
  const imagePairs = [];
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push({
      left: images[i],
      right: images[i + 1] || null
    });
  }

  const optimizeImage = (url, width = 800) => {
    if (!url) return "";
    if (url.includes("cloudinary.com")) {
      return url.replace("/upload/", `/upload/f_auto,q_auto:good,w_${width}/`);
    }
    return url;
  };

  const handleImageLoad = (id) => {
    setLoadingImages(prev => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') navigateImage(-1);
        if (e.key === 'ArrowRight') navigateImage(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentIndex, images.length]);

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      navigateImage(1);
    }
    if (touchStart - touchEnd < -50) {
      navigateImage(-1);
    }
  };

  const getImageIndex = (image) => {
    return images.findIndex(img => img.id === image.id);
  };

  return (
    <section className="page photography-page">
      <h2 className="page-title">Photography</h2>
      
      {images.length === 0 ? (
        <p className="empty-message">No photography images yet. Upload via the Admin panel.</p>
      ) : (
        <>
          <div className="photography-pairs">
            {imagePairs.map((pair, index) => (
              <div key={index} className="photography-pair">
                {/* Left Image */}
                <div className="photography-image-wrapper left-image">
                  <div className="photography-image-container" onClick={() => openModal(pair.left, getImageIndex(pair.left))}>
                    {!loadingImages[pair.left.id] && !imageErrors[pair.left.id] && (
                      <div className="image-placeholder-loading">
                        <div className="image-loading-spinner"></div>
                      </div>
                    )}
                    <img
                      src={optimizeImage(pair.left.url || pair.left.imageUrl, 800)}
                      alt={pair.left.title}
                      loading="lazy"
                      className={`photography-image ${
                        loadingImages[pair.left.id] ? "image-fade-in" : ""
                      }`}
                      onLoad={() => handleImageLoad(pair.left.id)}
                      onError={() => handleImageError(pair.left.id)}
                      style={{
                        display: loadingImages[pair.left.id] && !imageErrors[pair.left.id] ? "block" : "none",
                      }}
                    />
                    <div className="photography-image-overlay">
                      <h3>{pair.left.title || 'Untitled'}</h3>
                      <span className="view-hint">
                        <FaExpand /> Click to view
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                {pair.right && (
                  <div className="photography-image-wrapper right-image">
                    <div className="photography-image-container" onClick={() => openModal(pair.right, getImageIndex(pair.right))}>
                      {!loadingImages[pair.right.id] && !imageErrors[pair.right.id] && (
                        <div className="image-placeholder-loading">
                          <div className="image-loading-spinner"></div>
                        </div>
                      )}
                      <img
                        src={optimizeImage(pair.right.url || pair.right.imageUrl, 800)}
                        alt={pair.right.title}
                        loading="lazy"
                        className={`photography-image ${
                          loadingImages[pair.right.id] ? "image-fade-in" : ""
                        }`}
                        onLoad={() => handleImageLoad(pair.right.id)}
                        onError={() => handleImageError(pair.right.id)}
                        style={{
                          display: loadingImages[pair.right.id] && !imageErrors[pair.right.id] ? "block" : "none",
                        }}
                      />
                      <div className="photography-image-overlay">
                        <h3>{pair.right.title || 'Untitled'}</h3>
                        <span className="view-hint">
                          <FaExpand /> Click to view
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Image Counter */}
          <div className="photography-indicator">
            {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
          </div>
        </>
      )}

      {/* Modal for full image view - WITHOUT INFO */}
      {isModalOpen && selectedImage && (
        <div 
          className="photography-modal" 
          onClick={closeModal}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="photography-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button 
                  className="modal-nav modal-nav-left" 
                  onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                  disabled={currentIndex === 0}
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="modal-nav modal-nav-right" 
                  onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                  disabled={currentIndex === images.length - 1}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
            
            <div className="modal-image-wrapper">
              <img
                src={optimizeImage(selectedImage.url || selectedImage.imageUrl, 1600)}
                alt={selectedImage.title}
                className="modal-image"
                loading="eager"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600/1c1c1c/c9ad93?text=Image+Not+Found";
                }}
              />
            </div>

            {/* ✅ MODAL INFO REMOVED - Only image and navigation */}
          </div>
        </div>
      )}
    </section>
  );
}

export default Photography;