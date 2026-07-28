import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import SEO from './SEO';
import './Gallery.css';

function Gallery({ images }) {
  const [loadingImages, setLoadingImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [visibleImages, setVisibleImages] = useState(new Set());

  // ===== LAZY LOAD WITH INTERSECTION OBSERVER =====
  const imageRefs = useRef({});
  const observerRef = useRef(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            if (id) {
              setVisibleImages(prev => new Set([...prev, id]));
              // Unobserve after loaded
              observerRef.current.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '200px', // Load 200px before visible
        threshold: 0.01
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Register image elements for lazy loading
  useEffect(() => {
    Object.values(imageRefs.current).forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });
  }, [images]);

  const imagePairs = [];
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push({
      left: images[i],
      right: images[i + 1] || null
    });
  }

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
  }, [isModalOpen, currentIndex]);

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

  // ===== OPTIMIZED IMAGE URL =====
  const optimizeImage = (url, width = 800) => {
    if (!url) return "";
    
    // Cloudinary optimization with WebP
    if (url.includes("cloudinary.com")) {
      return url.replace(
        "/upload/", 
        `/upload/f_auto,q_auto:low,w_${width},c_scale/`
      );
    }
    
    // For other URLs, try to use smaller size
    if (url.includes("res.cloudinary.com")) {
      return url.replace(
        "/upload/", 
        `/upload/f_auto,q_auto:eco,w_${width},c_scale/`
      );
    }
    
    return url;
  };

  // ===== BLUR UP PREVIEW =====
  const getBlurImage = (url) => {
    if (!url) return "";
    if (url.includes("cloudinary.com")) {
      return url.replace(
        "/upload/", 
        `/upload/f_auto,q_auto:low,w_40,c_scale/`
      );
    }
    return url;
  };

  return (
    <>
      <SEO
        title="Kamesh Fine Art Gallery | Original Paintings, Portraits & Artwork"
        description="Explore the Kamesh Fine Art gallery featuring original paintings, realistic portraits, sketches, digital art and creative visual artworks."
        keywords="Kamesh Fine Art, Art Gallery, Paintings, Portraits, Sketches, Digital Art, Chennai Artist"
        url="https://www.kameshfineart.com/gallery"
      />

      <section className="page gallery-page">
        <h1 className="page-title">Kamesh Fine Art Gallery</h1>
        <p className="gallery-intro">
          Browse original paintings, portraits, sketches and fine art created by
          Kamesh Fine Art.
        </p>
        
        {images.length === 0 ? (
          <p className="empty-message">No images yet. Add some via the Admin panel.</p>
        ) : (
          <>
            <div className="gallery-pairs">
              {imagePairs.map((pair, index) => (
                <div key={index} className="gallery-pair">
                  {/* Left Image */}
                  <div className="gallery-image-wrapper left-image">
                    <div 
                      className="gallery-image-container" 
                      onClick={() => openModal(pair.left, getImageIndex(pair.left))}
                    >
                      {/* ===== BLUR UP PLACEHOLDER ===== */}
                      <img
                        src={getBlurImage(pair.left.url || pair.left.imageUrl)}
                        alt=""
                        className="image-blur-placeholder"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          filter: 'blur(20px)',
                          transform: 'scale(1.1)',
                          zIndex: 0,
                          opacity: loadingImages[pair.left.id] ? 0 : 1,
                          transition: 'opacity 0.5s ease'
                        }}
                      />
                      
                      {!loadingImages[pair.left.id] && (
                        <div className="image-placeholder-loading">
                          <div className="image-loading-spinner"></div>
                        </div>
                      )}
                      
                      <img
                        ref={(el) => {
                          if (el) {
                            imageRefs.current[pair.left.id] = el;
                            el.dataset.id = pair.left.id;
                          }
                        }}
                        src={visibleImages.has(pair.left.id) ? optimizeImage(pair.left.url || pair.left.imageUrl, 600) : ''}
                        data-src={optimizeImage(pair.left.url || pair.left.imageUrl, 600)}
                        alt={`${pair.left.title || "Artwork"} | Kamesh Fine Art`}
                        loading="lazy"
                        decoding="async"
                        className={`gallery-image ${loadingImages[pair.left.id] ? "image-fade-in" : ""}`}
                        onLoad={() => handleImageLoad(pair.left.id)}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found";
                        }}
                        style={{
                          display: loadingImages[pair.left.id] ? "block" : "none",
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      
                      <div className="gallery-image-overlay">
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
                    <div className="gallery-image-wrapper right-image">
                      <div 
                        className="gallery-image-container" 
                        onClick={() => openModal(pair.right, getImageIndex(pair.right))}
                      >
                        {/* ===== BLUR UP PLACEHOLDER ===== */}
                        <img
                          src={getBlurImage(pair.right.url || pair.right.imageUrl)}
                          alt=""
                          className="image-blur-placeholder"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'blur(20px)',
                            transform: 'scale(1.1)',
                            zIndex: 0,
                            opacity: loadingImages[pair.right.id] ? 0 : 1,
                            transition: 'opacity 0.5s ease'
                          }}
                        />
                        
                        {!loadingImages[pair.right.id] && (
                          <div className="image-placeholder-loading">
                            <div className="image-loading-spinner"></div>
                          </div>
                        )}
                        
                        <img
                          ref={(el) => {
                            if (el) {
                              imageRefs.current[pair.right.id] = el;
                              el.dataset.id = pair.right.id;
                            }
                          }}
                          src={visibleImages.has(pair.right.id) ? optimizeImage(pair.right.url || pair.right.imageUrl, 600) : ''}
                          data-src={optimizeImage(pair.right.url || pair.right.imageUrl, 600)}
                          alt={`${pair.right.title || "Artwork"} | Kamesh Fine Art`}
                          title={pair.right.title || "Kamesh Fine Art"}
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="800"
                          className={`gallery-image ${loadingImages[pair.right.id] ? "image-fade-in" : ""}`}
                          onLoad={() => handleImageLoad(pair.right.id)}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found";
                          }}
                          style={{
                            display: loadingImages[pair.right.id] ? "block" : "none",
                            position: 'relative',
                            zIndex: 1,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        
                        <div className="gallery-image-overlay">
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
          </>
        )}

        {/* Modal - Optimized with higher quality */}
        {isModalOpen && selectedImage && (
          <div 
            className="image-modal" 
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>
                <FaTimes />
              </button>
              
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
                src={optimizeImage(selectedImage.url || selectedImage.imageUrl, 1200)}
                alt={selectedImage.title}
                className="modal-image"
                loading="eager"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600/1c1c1c/c9ad93?text=Image+Not+Found";
                }}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default Gallery;