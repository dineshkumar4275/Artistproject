// frontend/src/components/Photography.js
import React, { useState, useEffect } from 'react';
import { FaExpand, FaSearch, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Photography.css';

function Photography({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get image URL
  const getImageUrl = (image) => {
    if (!image) return '';
    return image?.url || image?.imageUrl || '';
  };

  // Filter images based on search
  useEffect(() => {
    if (images && images.length > 0) {
      if (searchTerm.trim() === '') {
        setFilteredImages(images);
      } else {
        const filtered = images.filter(img => 
          img.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredImages(filtered);
      }
      setLoading(false);
    } else {
      setFilteredImages([]);
      setLoading(false);
    }
  }, [searchTerm, images]);

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
        if (e.key === 'ArrowRight') {
          const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
          if (currentIndex < filteredImages.length - 1) {
            setSelectedImage(filteredImages[currentIndex + 1]);
          }
        }
        if (e.key === 'ArrowLeft') {
          const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
          if (currentIndex > 0) {
            setSelectedImage(filteredImages[currentIndex - 1]);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, filteredImages, selectedImage]);

  // Navigation functions
  const nextImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
    if (currentIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentIndex + 1]);
    }
  };

  const prevImage = () => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage?.id);
    if (currentIndex > 0) {
      setSelectedImage(filteredImages[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <div className="photography-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="photography-page">
      {/* Header */}
      <section className="photography-header">
        <h1>📸 Photography Gallery</h1>
        <p>Explore my collection of photographs</p>
      </section>

      {/* Search Bar */}
      <div className="photography-search">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search photos by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="photo-count">
          {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'} found
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="photography-gallery">
        {filteredImages.length === 0 ? (
          <div className="empty-gallery">
            {images.length === 0 ? (
              <>
                <p>📸 No photos in the gallery yet.</p>
                <p className="empty-hint">Go to Admin panel to add photos.</p>
              </>
            ) : (
              <p>🔍 No photos match your search criteria.</p>
            )}
          </div>
        ) : (
          <div className="photo-grid">
            {filteredImages.map((img) => (
              <div 
                key={img.id || img._id} 
                className="photo-card"
                onClick={() => openModal(img)}
              >
                <div className="photo-wrapper">
                  <img 
                    src={getImageUrl(img)} 
                    alt={img.title || 'Photograph'}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x400/1c1c1c/c9ad93?text=Image+Not+Found';
                    }}
                  />
                  <div className="photo-overlay">
                    <div className="photo-overlay-content">
                      <h3>{img.title || 'Untitled'}</h3>
                      <span className="view-hint">
                        <FaExpand /> Click to view
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal for enlarged image */}
      {isModalOpen && selectedImage && (
        <div className="photo-modal" onClick={closeModal}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>
            
            {/* Navigation buttons */}
            {filteredImages.length > 1 && (
              <>
                <button 
                  className="modal-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  disabled={filteredImages.findIndex(img => img.id === selectedImage.id) === 0}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
                <button 
                  className="modal-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  disabled={filteredImages.findIndex(img => img.id === selectedImage.id) === filteredImages.length - 1}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            <img 
              src={getImageUrl(selectedImage)} 
              alt={selectedImage.title || 'Photograph'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600/1c1c1c/c9ad93?text=Image+Not+Found';
              }}
            />
            
            <div className="modal-info">
              <h3>{selectedImage.title || 'Untitled'}</h3>
              <span className="modal-counter">
                {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Photography;