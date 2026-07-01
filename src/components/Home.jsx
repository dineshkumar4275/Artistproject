// import React from 'react';
// import './Home.css';

// function Home({ images, setCurrentPage }) {
//   return (
//     <div className="home-page">
//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero">
//           <h1>Welcome to <strong>FRAMORA</strong></h1>
//           <p>Capturing moments, creating stories — explore the gallery.</p>
//           <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
//             View Gallery →
//           </button>
//         </div>
//       </section>

//       {/* Featured Gallery Section */}
//       <section className="home-gallery-section">
//         <div className="section-header">
//           <h2>Featured Gallery</h2>
//           <p>Explore our latest works</p>
//         </div>
//         <div className="featured-grid">
//           {images.slice(0, 4).map(img => (
//             <div key={img.id} className="featured-card">
//               <div className="featured-image-wrapper">
//                 <img src={img.url} alt={img.title} />
//               </div>
//               <p>{img.title}</p>
//             </div>
//           ))}
//         </div>
//         <div className="view-all-wrapper">
//           <button className="btn-primary" onClick={() => setCurrentPage('gallery')}>
//             View All Gallery →
//           </button>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="home-about-section">
//         <div className="section-header">
//           <h2>About the Artist</h2>
//           <p>Learn more about my journey</p>
//         </div>
//         <div className="about-content">
//           <p>
//             I'm a visual artist based in the Pacific Northwest, working with 
//             photography and digital media. My work explores the interplay of 
//             light, texture, and everyday moments.
//           </p>
//           <p>
//             This site is a living archive of my recent projects. Feel free to 
//             browse the gallery and reach out through the contact page.
//           </p>
//           <div className="about-stats">
//             <span>📸 10+ years</span>
//             <span>🖼️ {images.length} works</span>
//             <span>🌎 exhibited internationally</span>
//           </div>
//           <div className="about-button-wrapper">
//             <button className="btn-primary" onClick={() => setCurrentPage('about')}>
//               Read More →
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Contact Section */}
//       <section className="home-contact-section">
//         <div className="section-header">
//           <h2>Get in Touch</h2>
//           <p>I'd love to hear from you</p>
//         </div>
//         <div className="contact-card-wrapper">
//           <div className="contact-card">
//             <p><i className="fas fa-envelope"></i> hello@artstudio.com</p>
//             <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
//             <p><i className="fas fa-map-pin"></i> Seattle, WA</p>
//             <div className="social-links">
//               <a href="#"><i className="fab fa-instagram"></i></a>
//               <a href="#"><i className="fab fa-behance"></i></a>
//               <a href="#"><i className="fab fa-github"></i></a>
//             </div>
//             <div className="contact-button-wrapper">
//               <button className="btn-primary" onClick={() => setCurrentPage('contact')}>
//                 Contact Me →
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Home;

import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
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

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero">
          <h1>Welcome to <strong>ArtStudio</strong></h1>
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
                      <img src={img.url} alt={img.title} />
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

      {/* About Section */}
      <section className="home-about-section">
        <div className="section-header">
          <h2>About the Artist</h2>
          <p>Learn more about my journey</p>
        </div>
        <div className="about-content">
          <p>
            I'm a visual artist based in the Pacific Northwest, working with 
            photography and digital media. My work explores the interplay of 
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
            <p><i className="fas fa-envelope"></i> hello@artstudio.com</p>
            <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fas fa-map-pin"></i> Seattle, WA</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-behance"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
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
            <img src={selectedImage.url} alt={selectedImage.title} />
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