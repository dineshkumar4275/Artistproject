import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiLockClosed } from 'react-icons/hi';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage, isAdminLoggedIn, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  // Handle window resize for responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (page, e) => {
    e.preventDefault();
    
    // 🔒 If not logged in, redirect to login
    if (!isAdminLoggedIn && page !== 'home') {
      navigate('/login');
      setIsOpen(false);
      return;
    }
    
    setCurrentPage(page);
    setIsOpen(false);
    navigate(`/${page === 'home' ? '' : page}`);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      setIsOpen(false);
      document.body.style.overflow = 'unset';
      navigate('/login');
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (!isAdminLoggedIn) {
      navigate('/login');
      setIsOpen(false);
      return;
    }
    setCurrentPage('home');
    setIsOpen(false);
    navigate('/');
  };

  // Close menu on overlay click
  const handleOverlayClick = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'HOME', path: '/' },
    { id: 'gallery', label: 'GALLERY', path: '/gallery' },
    { id: 'photography', label: 'PHOTOGRAPHY', path: '/photography' },
    { id: 'about', label: 'ABOUT', path: '/about' },
    { id: 'contact', label: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-container">
          {/* Logo */}
          <div className="logo">
            <a 
              href="/" 
              onClick={handleLogoClick} 
              className="logo-link"
              aria-label="Go to home"
            >
              <span className="logo-tagline">KameshFineArt</span>
            </a>
          </div>
          
          {/* Hamburger Menu Button */}
          <button 
            className={`hamburger ${isOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>

          {/* Navigation Links */}
          <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
            {navItems.map(item => (
              <li key={item.id} className="nav-item">
                <Link 
                  to={item.path}
                  className={`nav-link ${currentPage === item.id ? 'active' : ''} ${!isAdminLoggedIn && item.id !== 'home' ? 'protected' : ''}`}
                  onClick={(e) => handleNavClick(item.id, e)}
                >
                  <span className="nav-label">{item.label}</span>
                  {!isAdminLoggedIn && item.id !== 'home' && (
                    <HiLockClosed className="lock-icon" size={14} />
                  )}
                </Link>
                {!isAdminLoggedIn && item.id !== 'home' && isMobile && (
                  <span className="login-hint">🔒 Login to access</span>
                )}
              </li>
            ))}
            
            {/* Admin/Login Link */}
            <li className="nav-item admin-item">
              <Link 
                to={isAdminLoggedIn ? "/admin" : "/login"} 
                className={`nav-link ${currentPage === 'admin' ? 'active' : ''} admin-link`}
                onClick={(e) => {
                  e.preventDefault();
                  if (isAdminLoggedIn) {
                    handleNavClick('admin', e);
                  } else {
                    navigate('/login');
                    setIsOpen(false);
                    document.body.style.overflow = 'unset';
                  }
                }}
              >
                <span className="nav-label">
                  {isAdminLoggedIn ? '👑 ADMIN' : '🔐 LOGIN'}
                </span>
              </Link>
            </li>
            
            {/* Logout Button */}
            {isAdminLoggedIn && (
              <li className="nav-item logout-item">
                <button 
                  onClick={handleLogout}
                  className="logout-btn"
                >
                  🚪 LOGOUT
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay" 
          onClick={handleOverlayClick}
          role="button"
          aria-label="Close menu"
        ></div>
      )}
    </>
  );
}

export default Navbar;