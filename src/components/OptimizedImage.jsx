import React, { useState, useEffect, useRef } from 'react';

function OptimizedImage({ src, alt, className, ...props }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="optimized-image-wrapper">
      {!isLoaded && (
        <div className="image-placeholder-loading">
          <div className="image-loading-spinner"></div>
        </div>
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'image-fade-in' : ''}`}
          onLoad={() => setIsLoaded(true)}
          style={{ display: isLoaded ? 'block' : 'none' }}
          {...props}
        />
      )}
    </div>
  );
}

export default OptimizedImage;