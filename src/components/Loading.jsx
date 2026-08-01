import React from 'react';
import './Loading.css';

function Loading({ type = 'page', message = 'Loading...' }) {
  if (type === 'page') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <a href="/">
            <img 
              src="/staticwebsite.png" 
              alt="KameshFineArt" 
              className="loading-logo-img"
              onError={(e) => {
                // Fallback if image doesn't load
                e.target.style.display = 'none';
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