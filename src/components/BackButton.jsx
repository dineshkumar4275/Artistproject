 import React from 'react';
import './BackButton.css';

function BackButton({ onClick, label = 'Back' }) {
  return (
    <button className="back-button" onClick={onClick}>
      <svg className="back-icon" viewBox="0 0 24 24" width="20" height="20">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
      </svg>
      {label}
    </button>
  );
}

export default BackButton;