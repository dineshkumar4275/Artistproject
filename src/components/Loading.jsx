import React from 'react';
import './Loading.css';

function Loading({ type = 'page' }) {
  if (type === 'page') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-logo">kameshfineart</div>
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="image-loading-container">
        <div className="image-placeholder">
          <div className="image-loading-spinner"></div>
          <p>Loading image...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default Loading;