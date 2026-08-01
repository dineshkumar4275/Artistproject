import React, { useState } from 'react';
import './Loading.css';

function Loading({ type = 'page', message = 'Loading...' }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (type === 'page') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          
          {/* ✅ Show placeholder while image loads */}
          {!imageLoaded && (
            <div className="image-placeholder-loading">
              <div className="image-loading-spinner-small"></div>
            </div>
          )}
          
          <a href="/">
            <img 
              src="/assets/og-image.png" 
              alt="KameshFineArt" 
              className={`loading-logo-img ${imageLoaded ? 'image-fade-in' : ''}`}
              style={{ display: imageLoaded ? 'block' : 'none' }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = 'none';
                setImageLoaded(true); // Hide placeholder on error
              }}
            />
          </a>
          
          <p className="loading-text">{message}</p>
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="image-loading-container">
        <div className="image-placeholder">
          <div className="image-loading-spinner"></div>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default Loading;