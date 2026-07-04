import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaLinkedin } from 'react-icons/fa';
import './Home.css';

function Home({ images, setCurrentPage }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const slideInterval = useRef(null);

  // Get featured images (first 6 or all if less)
  const featuredImages = images.slice(0, 6);
  const slidesToShow = Math.min(3, featuredImages.length);
  const totalSlides = Math.ceil(featuredImages.length / slidesToShow);

  // Auto-slide
  useEffect(() => {
    if (!isHovering && featuredImages.length > slidesToShow) {
      slideInterval.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }
    return () => clearInterval(slideInterval.current);
  }, [isHovering, featuredImages.length, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const getVisibleImages = () => {
    const start = currentSlide * slidesToShow;
    return featuredImages.slice(start, start + slidesToShow);
  };

  // Helper function to get image URL
  const getImageUrl = (image) => {
    return image.url || image.imageUrl || '';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero">
          <h1>Welcome to <strong>kameshfineart</strong></h1>
          <p>Capturing moments, creating stories — explore the gallery.</p>
          <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
            View Gallery →
          </button>
        </div>
      </section>

      {/* Featured Gallery Carousel Section */}
      <section className="home-gallery-section">
        <div className="section-header">
          <h2>Featured Gallery</h2>
          <p>Explore our latest works</p>
        </div>

        {featuredImages.length === 0 ? (
          <p className="empty-message">No images yet. Add some via the Admin panel.</p>
        ) : (
          <div 
            className="featured-carousel"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="carousel-container">
              {featuredImages.length > slidesToShow && (
                <>
                  <button className="carousel-nav carousel-prev" onClick={prevSlide}>
                    <FaChevronLeft />
                  </button>
                  <button className="carousel-nav carousel-next" onClick={nextSlide}>
                    <FaChevronRight />
                  </button>
                </>
              )}
              
              <div className="carousel-track">
                {getVisibleImages().map((img) => (
                  <div key={img.id} className="featured-card" onClick={() => openModal(img)}>
                    <div className="featured-image-wrapper">
                      <img 
                        src={getImageUrl(img)} 
                        alt={img.title} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found';
                        }}
                      />
                      <div className="featured-overlay">
                        <span className="featured-number">#{img.id}</span>
                        <h3>{img.title}</h3>
                        <span className="featured-hint">
                          <FaExpand /> Click to enlarge
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              {featuredImages.length > slidesToShow && (
                <div className="carousel-dots">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <span
                      key={idx}
                      className={`dot ${idx === currentSlide ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(idx)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="view-all-wrapper">
          <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
            View All Gallery →
          </button>
        </div>
      </section>
{/* Featured Video Section */}
<section className="featured-video-section">
  <div className="section-header">
    <h2>Featured Video</h2>
    <p>Watch our latest artwork showcase</p>
  </div>

  <div className="video-container">
    <video
      className="featured-video"
      controls
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="https://www.youtube.com/watch?v=qyvdYnTtBfE" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
</section>
      {/* About Section */}
      <section className="home-about-section">
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
            <span>🖼️ {images.length} works</span>
            <span>🌎 exhibited internationally</span>
          </div>
          <div className="about-button-wrapper">
            <button className="btn-primary" onClick={() => setCurrentPage('about')}>
              Read More →
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="home-contact-section">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>I'd love to hear from you</p>
        </div>
        <div className="contact-card-wrapper">
          <div className="contact-card">
            <p>
              <FaEnvelope /> 
              <a href="mailto:kameshfineart@gmail.com" className="contact-link">
                kameshfineart@gmail.com
              </a>
            </p>
            <p>
              <FaPhone /> 
              <a href="tel:+919345933994" className="contact-link">
                +91 93459 33994
              </a>
            </p>
            <p><FaMapMarkerAlt /> Chennai, Tamil Nadu</p>
            <div className="social-links">
              <a 
                href="https://www.instagram.com/urbaninkpen?igsh=MTlwbDgzdDgxd2xyMQ%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://www.behance.net/kameshfineart" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Behance"
              >
                <FaBehance />
              </a>
              <a 
                href="https://www.linkedin.com/in/kamesh-p-a89abb267?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
            </div>
            <div className="contact-button-wrapper">
              <button className="btn-primary" onClick={() => setCurrentPage('contact')}>
                Contact Me →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for enlarged image */}
      {isModalOpen && selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <img 
              src={getImageUrl(selectedImage)} 
              alt={selectedImage.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/1c1c1c/c9ad93?text=Image+Not+Found';
              }}
            />
            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              <span className="modal-number">#{selectedImage.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;