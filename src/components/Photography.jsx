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
  const [visibleImages, setVisibleImages] = useState([]);
  const observerRef = useRef(null);
  const modalRef = useRef(null);

  // Group images into rows of 2
  const imagePairs = [];
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push({
      left: images[i],
      right: images[i + 1] || null
    });
  }

  // ✅ Optimize image URL with better quality settings
  const optimizeImage = (url, width = 600, quality = 80) => {
    if (!url) return "";
    if (url.includes("cloudinary.com")) {
      // Use f_auto for format, q_auto for quality, and width for size
      return url.replace("/upload/", `/upload/f_auto,q_auto:good,w_${width}/`);
    }
    return url;
  };

  // ✅ Get thumbnail URL (smaller for faster loading)
  const getThumbnailUrl = (url) => {
    return optimizeImage(url, 400, 70);
  };

  // ✅ Get full image URL (larger for modal)
  const getFullImageUrl = (url) => {
    return optimizeImage(url, 1200, 90);
  };

  const handleImageLoad = (id) => {
    setLoadingImages(prev => ({ ...prev, [id]: true }));
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

  // ✅ Lazy load with Intersection Observer
  useEffect(() => {
    if (images.length === 0) return;

    // Only show first 4 images initially
    setVisibleImages(images.slice(0, 4));

    // Load remaining images lazily
    const loadMoreImages = () => {
      const currentCount = visibleImages.length;
      if (currentCount < images.length) {
        const nextBatch = images.slice(currentCount, currentCount + 2);
        setVisibleImages(prev => [...prev, ...nextBatch]);
      }
    };

    // Set up intersection observer for lazy loading
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreImages();
      }
    }, { rootMargin: '200px' });

    // Observe the last visible image
    const lastImageElement = document.querySelector('.photography-image-wrapper:last-child');
    if (lastImageElement) {
      observerRef.current.observe(lastImageElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [images, visibleImages.length]);

  // ✅ Use visible images for rendering
  const visibleImagePairs = [];
  for (let i = 0; i < visibleImages.length; i += 2) {
    visibleImagePairs.push({
      left: visibleImages[i],
      right: visibleImages[i + 1] || null
    });
  }

  return (
    <section className="page photography-page">
      <h2 className="page-title">Photography</h2>
      
      {images.length === 0 ? (
        <p className="empty-message">No photography images yet. Upload via the Admin panel.</p>
      ) : (
        <>
          <div className="photography-pairs">
            {visibleImagePairs.map((pair, index) => (
              <div key={index} className="photography-pair">
                {/* Left Image */}
                <div className="photography-image-wrapper left-image">
                  <div className="photography-image-container" onClick={() => openModal(pair.left, getImageIndex(pair.left))}>
                    {!loadingImages[pair.left.id] && (
                      <div className="image-placeholder-loading">
                        <div className="image-loading-spinner"></div>
                      </div>
                    )}
                    <img
                      src={getThumbnailUrl(pair.left.url || pair.left.imageUrl)}
                      alt={pair.left.title}
                      loading={index < 2 ? "eager" : "lazy"}
                      fetchPriority={index < 2 ? "high" : "auto"}
                      className={`photography-image ${
                        loadingImages[pair.left.id] ? "image-fade-in" : ""
                      }`}
                      onLoad={() => handleImageLoad(pair.left.id)}
                      onError={(e) => {
                        console.error("Image load error:", pair.left.url || pair.left.imageUrl);
                        e.target.src = "https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found";
                      }}
                      style={{
                        display: loadingImages[pair.left.id] ? "block" : "none",
                      }}
                    />
                    <div className="photography-image-overlay">
                      <span className="image-number">#{getImageIndex(pair.left) + 1}</span>
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
                      {!loadingImages[pair.right.id] && (
                        <div className="image-placeholder-loading">
                          <div className="image-loading-spinner"></div>
                        </div>
                      )}
                      <img
                        src={getThumbnailUrl(pair.right.url || pair.right.imageUrl)}
                        alt={pair.right.title}
                        loading="lazy"
                        className={`photography-image ${
                          loadingImages[pair.right.id] ? "image-fade-in" : ""
                        }`}
                        onLoad={() => handleImageLoad(pair.right.id)}
                        onError={(e) => {
                          console.error("Image load error:", pair.right.url || pair.right.imageUrl);
                          e.target.src = "https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found";
                        }}
                        style={{
                          display: loadingImages[pair.right.id] ? "block" : "none",
                        }}
                      />
                      <div className="photography-image-overlay">
                        <span className="image-number">#{getImageIndex(pair.right) + 1}</span>
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

          {/* Loading indicator for lazy loading */}
          {visibleImages.length < images.length && (
            <div className="loading-more">
              <div className="image-loading-spinner-small"></div>
              <span>Loading more photos...</span>
            </div>
          )}

          {/* Image Counter */}
          <div className="photography-indicator">
            {images.length} {images.length === 1 ? 'Photo' : 'Photos'}
          </div>
        </>
      )}

      {/* Modal for full image view */}
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
            
            <img
              src={getFullImageUrl(selectedImage.url || selectedImage.imageUrl)}
              alt={selectedImage.title}
              className="modal-image"
              loading="eager"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/800x600/1c1c1c/c9ad93?text=Image+Not+Found";
              }}
            />

            {/* Modal Info */}
            <div className="modal-info">
              <div className="modal-info-left">
                <span className="modal-number">
                  {currentIndex + 1} / {images.length}
                </span>
                <h3>{selectedImage.title || 'Untitled'}</h3>
                {selectedImage.description && (
                  <p className="modal-description">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Photography;