import React from 'react';
import './Loading.css';

function Loading({ type = 'page' }) {
  if (type === 'page') {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
<<<<<<< HEAD
          <div className="loading-logo">kameshfineart</div>
=======
          <div className="loading-logo">KameshFineArt</div>
>>>>>>> 7c9af6f44a75486801a1210d33d70f36b3abbcc3
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
