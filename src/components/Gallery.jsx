import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
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
  const [imagesLoaded, setImagesLoaded] = useState({});

  // ===== REFS FOR LAZY LOADING =====
  const imageRefs = useRef({});
  const observerRef = useRef(null);
  const containerRef = useRef(null);

  // ===== MEMOIZED IMAGE PAIRS =====
  const imagePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < images.length; i += 2) {
      pairs.push({
        left: images[i],
        right: images[i + 1] || null
      });
    }
    return pairs;
  }, [images]);

  // ===== OPTIMIZED IMAGE URL - CLOUDINARY =====
  const optimizeImage = useCallback((url, width = 800, isThumbnail = true) => {
    if (!url) return "";
    
    if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
      // Extract base URL before /upload/
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        const transformations = isThumbnail 
          ? `f_auto,q_auto:good,w_${width},c_limit,dpr_auto` 
          : `f_auto,q_auto:best,w_${width},c_limit,dpr_auto`;
        return `${parts[0]}/upload/${transformations}/${parts[1]}`;
      }
    }
    return url;
  }, []);

  // ===== BLUR UP PREVIEW (Tiny thumbnail) =====
  const getBlurImage = useCallback((url) => {
    if (!url) return "";
    if (url.includes("cloudinary.com") || url.includes("res.cloudinary.com")) {
      const parts = url.split("/upload/");
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto:low,w_30,c_limit/${parts[1]}`;
      }
    }
    return url;
  }, []);

  // ===== INTERSECTION OBSERVER FOR LAZY LOADING =====
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.dataset.id;
            if (id) {
              setVisibleImages(prev => new Set([...prev, id]));
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '300px',
        threshold: 0.01
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // ===== REGISTER IMAGES FOR LAZY LOADING =====
  useEffect(() => {
    Object.values(imageRefs.current).forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });
  }, [images]);

  // ===== HANDLE IMAGE LOAD =====
  const handleImageLoad = useCallback((id) => {
    setLoadingImages(prev => ({ ...prev, [id]: true }));
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  }, []);

  // ===== MODAL FUNCTIONS =====
  const openModal = useCallback((image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateImage = useCallback((direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  }, [currentIndex, images]);

  // ===== KEYBOARD NAVIGATION =====
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
  }, [isModalOpen, navigateImage, closeModal]);

  // ===== TOUCH NAVIGATION =====
  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 50) {
      navigateImage(1);
    }
    if (touchStart - touchEnd < -50) {
      navigateImage(-1);
    }
  }, [touchStart, touchEnd, navigateImage]);

  // ===== GET IMAGE INDEX =====
  const getImageIndex = useCallback((image) => {
    return images.findIndex(img => img.id === image.id);
  }, [images]);

  // ===== RENDER IMAGE COMPONENT =====
  const renderImage = useCallback((image, isRight = false) => {
    if (!image) return null;
    
    const index = getImageIndex(image);
    const isVisible = visibleImages.has(image.id);
    const isLoaded = loadingImages[image.id];
    const isPriority = index < 3;
    
    const width = isRight ? 600 : 600;
    const height = isRight ? 800 : 600;
    
    return (
      <div 
        className={`gallery-image-container`}
        onClick={() => openModal(image, index)}
        role="button"
        tabIndex={0}
        aria-label={`View ${image.title || 'artwork'}`}
      >
        {/* BLUR UP PLACEHOLDER */}
        <img
          src={getBlurImage(image.url || image.imageUrl)}
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
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.5s ease'
          }}
          aria-hidden="true"
        />
        
        {/* LOADING SPINNER */}
        {!isLoaded && (
          <div className="image-placeholder-loading">
            <div className="image-loading-spinner" aria-hidden="true"></div>
          </div>
        )}
        
        {/* MAIN IMAGE */}
        <img
          ref={(el) => {
            if (el) {
              imageRefs.current[image.id] = el;
              el.dataset.id = image.id;
            }
          }}
          src={isVisible ? optimizeImage(image.url || image.imageUrl, width, true) : ''}
          data-src={optimizeImage(image.url || image.imageUrl, width, true)}
          alt={`${image.title || 'Artwork'} | Kamesh Fine Art`}
          title={image.title || 'Kamesh Fine Art'}
          width={width}
          height={height}
          loading={isPriority ? "eager" : "lazy"}
          fetchPriority={isPriority ? "high" : "auto"}
          decoding="async"
          className={`gallery-image ${isLoaded ? "image-fade-in" : ""}`}
          onLoad={() => handleImageLoad(image.id)}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/600x600/1c1c1c/c9ad93?text=Image+Not+Found";
            handleImageLoad(image.id);
          }}
          style={{
            display: 'block',
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease'
          }}
        />
        
        {/* IMAGE OVERLAY */}
        <div className="gallery-image-overlay">
          <span className="image-number">#{index + 1}</span>
          <h3>{image.title || 'Untitled'}</h3>
          <span className="view-hint">
            <FaExpand /> Click to view
          </span>
        </div>
      </div>
    );
  }, [visibleImages, loadingImages, getImageIndex, openModal, optimizeImage, getBlurImage, handleImageLoad]);

  return (
    <>
      <SEO
        title="Kamesh Fine Art Gallery | Original Paintings, Portraits & Artwork"
        description="Explore the Kamesh Fine Art gallery featuring original paintings, realistic portraits, sketches, digital art and creative visual artworks."
        keywords="Kamesh Fine Art, Art Gallery, Paintings, Portraits, Sketches, Digital Art, Chennai Artist"
        url="https://www.kameshfineart.com/gallery"
      />

      <section className="page gallery-page" ref={containerRef}>
        <h1 className="page-title">Kamesh Fine Art Gallery</h1>
        <p className="gallery-intro">
          Browse original paintings, portraits, sketches and fine art created by
          Kamesh Fine Art.
        </p>
        
        {images.length === 0 ? (
          <p className="empty-message">No images yet. Add some via the Admin panel.</p>
        ) : (
          <div className="gallery-pairs">
            {imagePairs.map((pair, index) => (
              <div key={index} className="gallery-pair">
                {/* Left Image */}
                <div className="gallery-image-wrapper left-image">
                  {renderImage(pair.left, false)}
                </div>

                {/* Right Image */}
                {pair.right && (
                  <div className="gallery-image-wrapper right-image">
                    {renderImage(pair.right, true)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {isModalOpen && selectedImage && (
          <div 
            className="image-modal" 
            onClick={closeModal}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close" 
                onClick={closeModal}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
              
              {images.length > 1 && (
                <>
                  <button 
                    className="modal-nav modal-nav-left" 
                    onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
                    disabled={currentIndex === 0}
                    aria-label="Previous image"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    className="modal-nav modal-nav-right" 
                    onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
                    disabled={currentIndex === images.length - 1}
                    aria-label="Next image"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <img
                src={optimizeImage(selectedImage.url || selectedImage.imageUrl, 1200, false)}
                alt={selectedImage.title || 'Artwork'}
                className="modal-image"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width="1200"
                height="1600"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/1200x1600/1c1c1c/c9ad93?text=Image+Not+Found";
                }}
                style={{
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  objectFit: 'contain'
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