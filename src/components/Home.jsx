import React, { useState, useEffect } from 'react';
import { 
  FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaInstagram, FaBehance, FaLinkedin 
} from 'react-icons/fa';
import SEO from './SEO';
import './Home.css';

function Home({ images, setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredImages = images.slice(0, 8);

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isModalOpen) {
        if (e.key === 'Escape') closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.url && image.url.includes('cloudinary.com')) {
      return image.url;
    }
    return image.url || image.imageUrl || '';
  };

  const getOptimizedUrl = (url) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_400/');
    }
    return url;
  };

  return (
    <>
      <SEO 
        title="kameshfineart - Art Studio & Photography Portfolio"
        description="Welcome to kameshfineart's art studio. Explore stunning paintings, digital art, and photography. Discover unique artwork and creative expressions."
        keywords="art, paintings, digital art, photography, artist portfolio, kameshfineart, art studio"
        url="https://kameshfineart.com"
      />

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

        {/* Featured Gallery */}
        <section className="home-gallery-section">
          <div className="section-header">
            <h2>Featured Gallery</h2>
            <p>Explore our latest works</p>
          </div>

          {featuredImages.length === 0 ? (
            <p className="empty-message">No images yet. Add some via the Admin panel.</p>
          ) : (
            <div className="featured-grid">
              {featuredImages.map((img) => (
                <div key={img.id} className="featured-card" onClick={() => openModal(img)}>
                  <div className="featured-image-wrapper">
                    <img 
                      src={getOptimizedUrl(getImageUrl(img))} 
                      alt={img.title} 
                      loading="lazy"
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
          )}

          <div className="view-all-wrapper">
            <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
              View All Gallery →
            </button>
          </div>
        </section>

        {/* Featured Video */}
        <section className="featured-video-section">
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
            >
              <source
                src="https://res.cloudinary.com/dj5limxeb/video/upload/v1783353086/WhatsApp_Video_2026-07-04_at_5.18.58_PM_gb6q45_ydzrql.mp4"
                type="video/mp4"
              />
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
                  href="https://www.instagram.com/urbaninkpen" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
                <a 
                  href="https://www.behance.net/kameshfineart" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FaBehance />
                </a>
                <a 
                  href="https://www.linkedin.com/in/kamesh-p-a89abb267" 
                  target="_blank" 
                  rel="noopener noreferrer"
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

        {/* Modal */}
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
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;