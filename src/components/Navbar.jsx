import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaImages, FaInfoCircle, FaEnvelope, FaCog, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage, isAdminLoggedIn, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check for saved dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      setIsOpen(false);
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setCurrentPage('home');
    setIsOpen(false);
    navigate('/');
  };

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (isAdminLoggedIn) {
      setCurrentPage('admin');
    } else {
      setCurrentPage('admin');
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isDarkMode ? 'dark' : ''}`}>
        <div className="logo">
          <a href="/" onClick={handleLogoClick} className="logo-link">
            <img 
              src="/assets/staticwebsite.png" 
              alt="kameshfineart" 
              className="logo-image"
            />
            <span className="logo-tagline">FRAMING MEMORIES FOREVER</span>
          </a>
        </div>
        
        <div className="nav-right">
          {/* Dark Mode Toggle */}
          <button 
            className={`dark-mode-toggle ${isDarkMode ? 'active' : ''}`} 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="hamburger-wrapper">
            <button 
              className={`hamburger ${isOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => handleNavClick('home')}
            >
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link 
              to="/gallery" 
              className={currentPage === 'gallery' ? 'active' : ''}
              onClick={() => handleNavClick('gallery')}
            >
              <FaImages /> Gallery
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={currentPage === 'about' ? 'active' : ''}
              onClick={() => handleNavClick('about')}
            >
              <FaInfoCircle /> About
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={currentPage === 'contact' ? 'active' : ''}
              onClick={() => handleNavClick('contact')}
            >
              <FaEnvelope /> Contact
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={handleAdminClick}
            >
              <FaCog /> {isAdminLoggedIn ? 'Admin' : 'Login'}
            </Link>
          </li>
          {isAdminLoggedIn && (
            <li className="logout-item">
              <a 
                href="#logout" 
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                className="logout-link"
              >
                <FaSignOutAlt /> Logout
              </a>
            </li>
          )}
        </ul>
      </nav>

      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
    </>
  );
}

export default Navbar;