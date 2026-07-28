import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaInstagram, FaBehance, FaLinkedin, FaCamera,
  FaWhatsapp
} from 'react-icons/fa';
import './Home.css';
import SEO from './SEO';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://artistproject-backend.vercel.app/api';

function Home({ images = [], photographyImages = [], setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  // ===== MEMOIZED FEATURED IMAGES =====
  const featuredImages = useMemo(() => images.slice(0, 8), [images]);
  const featuredPhotography = useMemo(() => photographyImages.slice(0, 4), [photographyImages]);

  // ===== IMAGE URL OPTIMIZATION =====
  const getImageUrl = useCallback((image) => {
    if (!image) return '';
    if (image.url?.startsWith('/api/')) {
      return `${API_BASE_URL}${image.url}`;
    }
    return image.url || image.imageUrl || '';
  }, []);

  // ===== CLOUDINARY OPTIMIZATION =====
  const optimizeImage = useCallback((url, width = 600) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') || url.includes('res.cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        return `${parts[0]}/upload/f_auto,q_auto:good,w_${width},c_limit,dpr_auto/${parts[1]}`;
      }
    }
    return url;
  }, []);

  // ===== GET IMAGE INDEX =====
  const getImageIndex = useCallback((image) => {
    if (!image) return -1;
    return images.findIndex(img => img.id === image.id);
  }, [images]);

  // ===== MODAL FUNCTIONS =====
  const openModal = useCallback((image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  // ===== KEYBOARD ESCAPE =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen && e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  // ===== HANDLE IMAGE LOAD =====
  const handleImageLoad = useCallback((id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  }, []);

  // ===== WHATSAPP LINK =====
  const whatsappNumber = '919345933994';
  const whatsappMessage = 'Hi Kamesh, I would like to know more about your art!';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  // ===== TOTAL WORKS =====
  const totalWorks = images.length + photographyImages.length;

  return (
    <div className="home-page">
      {/* ===== SEO - MOVED TO TOP ===== */}
      <SEO
        page="home"
        title="Kamesh Fine Art | Original Paintings, Portraits & Photography"
        description="Kamesh Fine Art - Original paintings, realistic portraits, sketches and fine art photography by artist Kamesh from Chennai, Tamil Nadu, India."
        url="https://www.kameshfineart.com/"
        image="https://www.kameshfineart.com/assets/og-image.jpg"
      />

      {/* ===== HERO SECTION ===== */}
      <section className="hero-section" aria-label="Hero banner">
        <div className="hero">
          <h1>Kamesh Fine Art</h1>
          <p>
            Original Fine Art, Realistic Portraits, Sketches and Photography by
            artist Kamesh.
          </p>
        </div>
      </section>

      {/* ===== FEATURED GALLERY ===== */}
      <section className="home-gallery-section" aria-label="Featured gallery">
        <div className="section-header">
          <h2>Featured Gallery</h2>
          <p>Explore our latest works</p>
        </div>
        {featuredImages.length === 0 ? (
          <p className="empty-message">No images yet. Add some via the Admin panel.</p>
        ) : (
          <div className="featured-grid">
            {featuredImages.map((img, index) => {
              const imgIndex = getImageIndex(img);
              const isPriority = index < 4;
              const imageUrl = getImageUrl(img);
              const optimizedUrl = optimizeImage(imageUrl, 600);
              
              return (
                <div 
                  key={img.id} 
                  className="featured-card" 
                  onClick={() => openModal(img)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.title || 'artwork'}`}
                  onKeyDown={(e) => e.key === 'Enter' && openModal(img)}
                >
                  <div className="featured-image-wrapper">
                    {!loadedImages[img.id] && (
                      <div className="image-placeholder-loading">
                        <div className="image-loading-spinner"></div>
                      </div>
                    )}
                    <img
                      src={optimizedUrl}
                      alt={`${img.title || 'Artwork'} - Original painting by Kamesh Fine Art`}
                      title={`${img.title || 'Artwork'} by Kamesh Fine Art`}
                      loading={isPriority ? "eager" : "lazy"}
                      fetchPriority={isPriority ? "high" : "auto"}
                      decoding="async"
                      width="600"
                      height="600"
                      className={`gallery-image ${loadedImages[img.id] ? 'image-fade-in' : ''}`}
                      onLoad={() => handleImageLoad(img.id)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x600/1c1c1c/c9ad93?text=Image+Not+Found';
                        handleImageLoad(img.id);
                      }}
                      style={{
                        display: loadedImages[img.id] ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="view-all-wrapper">
          <button 
            className="btn-primary" 
            onClick={() => setCurrentPage('gallery')}
            aria-label="View all gallery artworks"
          >
            View All Gallery →
          </button>
        </div>
      </section>

      {/* ===== FEATURED VIDEO ===== */}
      <section className="featured-video-section" aria-label="Featured video">
        <div className="section-header">
          <h2>Featured Video</h2>
          <p>Watch our latest artwork showcase</p>
        </div>
        <div className="video-container">
          <video 
            className="featured-video" 
            controls 
            playsInline 
            preload="metadata"
            aria-label="Artwork showcase video"
            poster="/assets/video-poster.jpg"
          >
            <source
              src="https://res.cloudinary.com/dj5limxeb/video/upload/v1783353086/WhatsApp_Video_2026-07-04_at_5.18.58_PM_gb6q45_ydzrql.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* ===== PHOTOGRAPHY SECTION ===== */}
      <section className="home-photography-section" aria-label="Featured photography">
        <div className="section-header">
          <h2><FaCamera aria-hidden="true" /> Photography</h2>
          <p>Explore our stunning photography collection</p>
        </div>
        {featuredPhotography.length === 0 ? (
          <p className="empty-message">No photography images yet. Upload via the Admin panel.</p>
        ) : (
          <div className="photography-featured-grid">
            {featuredPhotography.map((img, index) => {
              const isPriority = index < 2;
              const imageUrl = getImageUrl(img);
              const optimizedUrl = optimizeImage(imageUrl, 600);
              
              return (
                <div 
                  key={img.id} 
                  className="photography-featured-card" 
                  onClick={() => openModal(img)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${img.title || 'photograph'}`}
                  onKeyDown={(e) => e.key === 'Enter' && openModal(img)}
                >
                  <div className="photography-featured-image-wrapper">
                    {!loadedImages[img.id] && (
                      <div className="image-placeholder-loading">
                        <div className="image-loading-spinner"></div>
                      </div>
                    )}
                    <img
                      src={optimizedUrl}
                      alt={`${img.title || 'Photograph'} - Fine art photography by Kamesh Fine Art`}
                      title={`${img.title || 'Photograph'} by Kamesh Fine Art`}
                      loading={isPriority ? "eager" : "lazy"}
                      fetchPriority={isPriority ? "high" : "auto"}
                      decoding="async"
                      width="600"
                      height="600"
                      className={`gallery-image ${loadedImages[img.id] ? 'image-fade-in' : ''}`}
                      onLoad={() => handleImageLoad(img.id)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x600/1c1c1c/8b6b4f?text=Photo+Not+Found';
                        handleImageLoad(img.id);
                      }}
                      style={{
                        display: loadedImages[img.id] ? 'block' : 'none',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="view-all-wrapper">
          <button 
            className="btn-primary photography-btn" 
            onClick={() => setCurrentPage('photography')}
            aria-label="View all photography"
          >
            <FaCamera aria-hidden="true" /> View All Photography →
          </button>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="home-about-section" aria-label="About the artist">
        <div className="section-header">
          <h2>About the Artist</h2>
          <p>Learn more about my journey</p>
        </div>
        <div className="about-content">
          <p>
            I'm a visual artist based in Chennai, Tamil Nadu, working with 
            traditional and digital media. My work explores the interplay of 
            light, texture, and everyday moments.
          </p>
          <p>
            This site is a living archive of my recent projects. Feel free to 
            browse the gallery and reach out through the contact page.
          </p>
          <div className="about-stats">
            <span>📸 10+ years</span>
            <span>🖼️ {totalWorks} works</span>
            <span>🌎 exhibited internationally</span>
          </div>
          <div className="about-button-wrapper">
            <button 
              className="btn-primary" 
              onClick={() => setCurrentPage('about')}
              aria-label="Read more about the artist"
            >
              Read More →
            </button>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section className="home-contact-section" aria-label="Contact information">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>I'd love to hear from you</p>
        </div>
        <div className="contact-card-wrapper">
          <div className="contact-card">
            <p>
              <FaEnvelope aria-hidden="true" /> 
              <a href="mailto:kameshfineart@gmail.com" className="contact-link">
                kameshfineart@gmail.com
              </a>
            </p>
            <p>
              <FaPhone aria-hidden="true" /> 
              <a href="tel:+919345933994" className="contact-link">
                +91 93459 33994
              </a>
            </p>
            <p><FaMapMarkerAlt aria-hidden="true" /> Chennai, Tamil Nadu, India</p>
            
            {/* ===== SOCIAL LINKS ===== */}
            <div className="social-links">
              <a 
                href="https://www.instagram.com/urbaninkpen?igsh=MTlwbDgzdDgxd2xyMQ%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Follow Kamesh Fine Art on Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://www.behance.net/kameshfineart" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="View Kamesh Fine Art on Behance"
              >
                <FaBehance />
              </a>
              <a 
                href="https://www.linkedin.com/in/kamesh-p-a89abb267?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Connect with Kamesh on LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
            
            <div className="contact-button-wrapper">
              <button 
                className="btn-primary" 
                onClick={() => setCurrentPage('contact')}
                aria-label="Go to contact page"
              >
                Contact Me →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHATSAPP FLOATING BUTTON ===== */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat with Kamesh on WhatsApp"
      >
        <FaWhatsapp aria-hidden="true" />
        <span className="whatsapp-tooltip">Chat with me</span>
      </a>

      {/* ===== IMAGE MODAL ===== */}
      {isModalOpen && selectedImage && (
        <div 
          className="image-modal" 
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={closeModal}
              aria-label="Close image viewer"
            >
              ✕
            </button>
            <img 
              src={optimizeImage(getImageUrl(selectedImage), 1200)} 
              alt={`${selectedImage.title || 'Artwork'} by Kamesh Fine Art`}
              title={`${selectedImage.title || 'Artwork'} by Kamesh Fine Art`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1200"
              height="1200"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x1200/1c1c1c/c9ad93?text=Image+Not+Found';
              }}
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain'
              }}
            />
            <div className="modal-info">
              <h3>{selectedImage.title || 'Untitled'}</h3>
              <span className="modal-number">#{selectedImage.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;