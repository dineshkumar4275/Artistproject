import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage, isAdminLoggedIn, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
      <nav className="navbar">
        <div className="logo">
          <a href="/" onClick={handleLogoClick} className="logo-link">
            {/* <img 
              src="/assets/staticwebsite.png" 
              alt="FRAMORA" 
              className="logo-image"
            /> */}
            <span className="logo-tagline">KameshFineArt</span>
          </a>
        </div>
        
        <div className="hamburger-wrapper">
          <button 
            className={`hamburger ${isOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={currentPage === 'home' ? 'active' : ''}
              onClick={() => handleNavClick('home')}
            >
              HOME
            </Link>
          </li>
          <li>
            <Link 
              to="/gallery" 
              className={currentPage === 'gallery' ? 'active' : ''}
              onClick={() => handleNavClick('gallery')}
            >
              GALLERY
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={currentPage === 'about' ? 'active' : ''}
              onClick={() => handleNavClick('about')}
            >
              ABOUT
            </Link>
          </li>
          // Add this to your Navbar component's navigation links
<Nav.Link 
  className={currentPage === 'photography' ? 'active' : ''}
  onClick={() => setCurrentPage('photography')}
>
  Photography
</Nav.Link>
          <li>
            <Link 
              to="/contact" 
              className={currentPage === 'contact' ? 'active' : ''}
              onClick={() => handleNavClick('contact')}
            >
              CONTACT
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={handleAdminClick}
            >
              {isAdminLoggedIn ? 'ADMIN' : 'LOGIN'}
            </Link>
          </li>
          {isAdminLoggedIn && (
            <li className="logout-item">
              <a 
                href="#logout" 
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                className="logout-link"
              >
                LOGOUT
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