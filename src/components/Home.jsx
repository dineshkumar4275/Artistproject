import React, { useState, useEffect, useRef } from 'react';
import { FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaLinkedin } from 'react-icons/fa';
import './Home.css';

function Home({ images, setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Get featured images (first 8)
  const featuredImages = images.slice(0, 8);

  // Group images into rows of 2
  const imageRows = [];
  for (let i = 0; i < featuredImages.length; i += 2) {
    imageRows.push({
      left: featuredImages[i],
      right: featuredImages[i + 1] || null
    });
  }

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

      {/* Featured Gallery - 2x2 Grid */}
      <section className="home-gallery-section">
        <div className="section-header">
          <h2>Featured Gallery</h2>
          <p>Explore our latest works</p>
        </div>

        {featuredImages.length === 0 ? (
          <p className="empty-message">No images yet. Add some via the Admin panel.</p>
        ) : (
          <div className="featured-grid">
            {imageRows.map((row, rowIndex) => (
              <div key={rowIndex} className="gallery-row">
                {/* Left Image */}
                <div className="featured-card" onClick={() => openModal(row.left)}>
                  <div className="featured-image-wrapper">
                    <img 
                      src={getImageUrl(row.left)} 
                      alt={row.left.title} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found';
                      }}
                    />
                    <div className="featured-overlay">
                      <span className="featured-number">#{row.left.id}</span>
                      <h3>{row.left.title}</h3>
                      <span className="featured-hint">
                        <FaExpand /> Click to enlarge
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                {row.right && (
                  <div className="featured-card" onClick={() => openModal(row.right)}>
                    <div className="featured-image-wrapper">
                      <img 
                        src={getImageUrl(row.right)} 
                        alt={row.right.title} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300/1c1c1c/c9ad93?text=Image+Not+Found';
                        }}
                      />
                      <div className="featured-overlay">
                        <span className="featured-number">#{row.right.id}</span>
                        <h3>{row.right.title}</h3>
                        <span className="featured-hint">
                          <FaExpand /> Click to enlarge
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
          <iframe
            className="featured-video"
            width="100%"
            height="500"
            src="https://www.youtube.com/embed/qyvdYnTtBfE"
            title="Featured Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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