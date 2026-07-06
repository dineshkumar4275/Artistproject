import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiMenu, 
  HiX, 
  HiHome, 
  HiPhotograph, 
  HiCamera, 
  HiUser, 
  HiMail, 
  HiLogin, 
  HiLogout,
  HiOutlineUserGroup
} from 'react-icons/hi';
import { FaImage, FaCameraRetro } from 'react-icons/fa';
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
              <HiHome className="nav-icon" />
              HOME
            </Link>
          </li>
          <li>
            <Link 
              to="/gallery" 
              className={currentPage === 'gallery' ? 'active' : ''}
              onClick={() => handleNavClick('gallery')}
            >
              <FaImage className="nav-icon" />
              GALLERY
            </Link>
          </li>
          <li>
            <Link 
              to="/photography" 
              className={currentPage === 'photography' ? 'active' : ''}
              onClick={() => handleNavClick('photography')}
            >
              <FaCameraRetro className="nav-icon" />
              PHOTOGRAPHY
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={currentPage === 'about' ? 'active' : ''}
              onClick={() => handleNavClick('about')}
            >
              <HiUser className="nav-icon" />
              ABOUT
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={currentPage === 'contact' ? 'active' : ''}
              onClick={() => handleNavClick('contact')}
            >
              <HiMail className="nav-icon" />
              CONTACT
            </Link>
          </li>
          <li>
            <Link 
              to="/admin" 
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={handleAdminClick}
            >
              {isAdminLoggedIn ? (
                <>
                  <HiOutlineUserGroup className="nav-icon" />
                  ADMIN
                </>
              ) : (
                <>
                  <HiLogin className="nav-icon" />
                  LOGIN
                </>
              )}
            </Link>
          </li>
          {isAdminLoggedIn && (
            <li className="logout-item">
              <a 
                href="#logout" 
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                className="logout-link"
              >
                <HiLogout className="nav-icon" />
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