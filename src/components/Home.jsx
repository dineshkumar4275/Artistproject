import React, { useState, useEffect } from 'react';
import { 
  FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, 
  FaInstagram, FaBehance, FaLinkedin, FaCamera,
  FaWhatsapp
} from 'react-icons/fa';
import './Home.css';
import SEO from './SEO';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://artistproject-backend.vercel.app/api';

function Home({ images, photographyImages = [], setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredImages = images.slice(0, 8);
  const featuredPhotography = photographyImages.slice(0, 4);

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
      if (isModalOpen && e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.url?.startsWith('/api/')) {
      return `${API_BASE_URL}${image.url}`;
    }
    return image.url || image.imageUrl || '';
  };

  // WhatsApp link
  const whatsappNumber = '919345933994';
  const whatsappMessage = 'Hi Kamesh, I would like to know more about your art!';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero">
          <h1>Kamesh Fine Art</h1>
          <p>
            Original Fine Art, Realistic Portraits, Sketches and Photography by
            artist Kamesh.
          </p>
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
                    src={getImageUrl(img)}
                    alt={`${img.title} | Kamesh Fine Art`}
                    loading="lazy"
                    width="600"
                    height="600"
                  />
              
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
          <video className="featured-video" controls playsInline preload="metadata">
            <source
              src="https://res.cloudinary.com/dj5limxeb/video/upload/v1783353086/WhatsApp_Video_2026-07-04_at_5.18.58_PM_gb6q45_ydzrql.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Photography Section */}
      <section className="home-photography-section">
        <div className="section-header">
          <h2><FaCamera /> Photography</h2>
          <p>Explore our stunning photography collection</p>
        </div>
        {featuredPhotography.length === 0 ? (
          <p className="empty-message">No photography images yet. Upload via the Admin panel.</p>
        ) : (
          <div className="photography-featured-grid">
            {featuredPhotography.map((img) => (
              <div key={img.id} className="photography-featured-card" onClick={() => openModal(img)}>
                <div className="photography-featured-image-wrapper">
                  <img src={getImageUrl(img)} alt={img.title} />
                </div>
                <div className="photography-featured-overlay">
                  <span className="photography-badge">📸</span>
                  <h3>{img.title}</h3>
                  {img.description && <p className="photography-featured-desc">{img.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="view-all-wrapper">
          <button className="btn-primary photography-btn" onClick={() => setCurrentPage('photography')}>
            <FaCamera /> View All Photography →
          </button>
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
            <span>🖼️ {images.length + photographyImages.length} works</span>
            <span>🌎 exhibited internationally</span>
          </div>
          <div className="about-button-wrapper">
            <button className="btn-primary" onClick={() => setCurrentPage('about')}>
              Read More →
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section - All Social Links Here */}
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
            
            {/* ===== SOCIAL LINKS - Instagram, Behance, LinkedIn ===== */}
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

      {/* ===== WHATSAPP FLOATING BUTTON - BOTTOM RIGHT ===== */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
        <span className="whatsapp-tooltip">Chat with me</span>
      </a>

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