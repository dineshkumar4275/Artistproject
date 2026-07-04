import React, { useState, useEffect, useRef } from 'react';
import { FaExpand, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaLinkedin, FaPlay, FaYoutube } from 'react-icons/fa';
import './Home.css';

function Home({ images, setCurrentPage }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get featured images (first 8)
  const featuredImages = images.slice(0, 8);

  // Video data
  const videos = [
    {
      id: 1,
      title: "Artwork Showcase",
      description: "Watch our latest artwork creation process",
      url: "https://www.youtube.com/embed/qyvdYnTtBfE",
      thumbnail: "https://img.youtube.com/vi/qyvdYnTtBfE/maxresdefault.jpg"
    },
    {
      id: 2,
      title: "Behind the Scenes",
      description: "See how we create our masterpieces",
      url: "https://www.youtube.com/embed/qyvdYnTtBfE",
      thumbnail: "https://img.youtube.com/vi/qyvdYnTtBfE/maxresdefault.jpg"
    }
  ];

  // Group videos into rows of 2
  const videoRows = [];
  for (let i = 0; i < videos.length; i += 2) {
    videoRows.push({
      left: videos[i],
      right: videos[i + 1] || null
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
            {featuredImages.map((img, index) => (
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
          <h2>Featured Videos</h2>
          <p>Watch our latest artwork showcases</p>
        </div>

        <div className="video-grid">
          {videoRows.map((row, rowIndex) => (
            <div key={rowIndex} className="video-row">
              {/* Left Video */}
              <div className="video-card">
                <div className="video-wrapper">
                  <iframe
                    className="video-iframe"
                    src={row.left.url}
                    title={row.left.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                  <div className="video-overlay">
                    <div className="video-play-btn">
                      <FaPlay />
                    </div>
                    <div className="video-info">
                      <h3>{row.left.title}</h3>
                      <p>{row.left.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Video */}
              {row.right && (
                <div className="video-card">
                  <div className="video-wrapper">
                    <iframe
                      className="video-iframe"
                      src={row.right.url}
                      title={row.right.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    ></iframe>
                    <div className="video-overlay">
                      <div className="video-play-btn">
                        <FaPlay />
                      </div>
                      <div className="video-info">
                        <h3>{row.right.title}</h3>
                        <p>{row.right.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="view-all-wrapper">
          <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
            View More Videos →
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