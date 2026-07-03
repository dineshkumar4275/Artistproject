// // import React, { useState } from 'react';
// // import { FaHome, FaImages, FaInfoCircle, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
// // import { HiMenu, HiX } from 'react-icons/hi';
// // import './Navbar.css';

// // function Navbar({ currentPage, setCurrentPage, isAdminLoggedIn, onLogout }) {
// //   const [isOpen, setIsOpen] = useState(false);

// //   const handleNavClick = (page) => {
// //     setCurrentPage(page);
// //     setIsOpen(false);
// //   };

// //   const toggleMenu = () => {
// //     setIsOpen(!isOpen);
// //   };

// //   const handleLogout = () => {
// //     if (window.confirm('Are you sure you want to logout?')) {
// //       onLogout();
// //       setIsOpen(false);
// //     }
// //   };

// //   const handleLogoClick = (e) => {
// //     e.preventDefault();
// //     setCurrentPage('home');
// //     setIsOpen(false);
// //   };

// //   return (
// //     <>
// //       <nav className="navbar">
// //         <div className="logo">
// //           <a href="/" onClick={handleLogoClick} className="logo-link">
// //             <img 
// //               src="/assets/staticwebsite.png" 
// //               alt="kameshfineart" 
// //               className="logo-image"
// //             />
// //             {/* <span className="logo-tagline">FRAMING MEMORIES FOREVER</span> */}
// //           </a>
// //         </div>
        
// //         <div className="hamburger-wrapper">
// //           <button 
// //             className={`hamburger ${isOpen ? 'active' : ''}`} 
// //             onClick={toggleMenu}
// //             aria-label="Toggle navigation menu"
// //           >
// //             {isOpen ? <HiX /> : <HiMenu />}
// //           </button>
// //         </div>

// //         <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
// //           <li>
// //             <a 
// //               href="#home" 
// //               className={currentPage === 'home' ? 'active' : ''}
// //               onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
// //             >
// //               <FaHome /> Home
// //             </a>
// //           </li>
// //           <li>
// //             <a 
// //               href="#gallery" 
// //               className={currentPage === 'gallery' ? 'active' : ''}
// //               onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}
// //             >
// //               <FaImages /> Gallery
// //             </a>
// //           </li>
// //           <li>
// //             <a 
// //               href="#about" 
// //               className={currentPage === 'about' ? 'active' : ''}
// //               onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
// //             >
// //               <FaInfoCircle /> About
// //             </a>
// //           </li>
// //           <li>
// //             <a 
// //               href="#contact" 
// //               className={currentPage === 'contact' ? 'active' : ''}
// //               onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
// //             >
// //               <FaEnvelope /> Contact
// //             </a>
// //           </li>
// //           <li>
// //             {isAdminLoggedIn ? (
// //               <a 
// //                 href="#admin" 
// //                 className={currentPage === 'admin' ? 'active' : ''}
// //                 onClick={(e) => { e.preventDefault(); handleNavClick('admin'); }}
// //               >
// //                 <FaCog /> Admin
// //               </a>
// //             ) : (
// //               <a 
// //                 href="#admin" 
// //                 onClick={(e) => { e.preventDefault(); handleNavClick('admin'); }}
// //               >
// //                 <FaCog /> Login
// //               </a>
// //             )}
// //           </li>
// //           {isAdminLoggedIn && (
// //             <li className="logout-item">
// //               <a 
// //                 href="#logout" 
// //                 onClick={(e) => { e.preventDefault(); handleLogout(); }}
// //                 className="logout-link"
// //               >
// //                 <FaSignOutAlt /> Logout
// //               </a>
// //             </li>
// //           )}
// //         </ul>
// //       </nav>

// //       {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
// //     </>
// //   );
// // }

// // export default Navbar;

// import React, { useState } from 'react';
// import { FaHome, FaImages, FaInfoCircle, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
// import { HiMenu, HiX } from 'react-icons/hi';
// import './Navbar.css';

// function Navbar({ currentPage, setCurrentPage, isAdminLoggedIn, onLogout }) {
//   const [isOpen, setIsOpen] = useState(false);

//   const handleNavClick = (page) => {
//     setCurrentPage(page);
//     setIsOpen(false);
//   };

//   const toggleMenu = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       onLogout();
//       setIsOpen(false);
//     }
//   };

//   const handleLogoClick = (e) => {
//     e.preventDefault();
//     setCurrentPage('home');
//     setIsOpen(false);
//   };

//   const handleAdminClick = (e) => {
//     e.preventDefault();
//     if (isAdminLoggedIn) {
//       setCurrentPage('admin');
//     } else {
//       setCurrentPage('admin'); // This will show login page
//     }
//     setIsOpen(false);
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="logo">
//           <a href="/" onClick={handleLogoClick} className="logo-link">
//             <img 
//               src="/assets/staticwebsite.png" 
//               alt="kameshfineart" 
//               className="logo-image"
//             />
//             {/* <span className="logo-tagline">FRAMING MEMORIES FOREVER</span> */}
//           </a>
//         </div>
        
//         <div className="hamburger-wrapper">
//           <button 
//             className={`hamburger ${isOpen ? 'active' : ''}`} 
//             onClick={toggleMenu}
//             aria-label="Toggle navigation menu"
//           >
//             {isOpen ? <HiX /> : <HiMenu />}
//           </button>
//         </div>

//         <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
//           <li>
//             <a 
//               href="#home" 
//               className={currentPage === 'home' ? 'active' : ''}
//               onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
//             >
//               <FaHome /> Home
//             </a>
//           </li>
//           <li>
//             <a 
//               href="#gallery" 
//               className={currentPage === 'gallery' ? 'active' : ''}
//               onClick={(e) => { e.preventDefault(); handleNavClick('gallery'); }}
//             >
//               <FaImages /> Gallery
//             </a>
//           </li>
//           <li>
//             <a 
//               href="#about" 
//               className={currentPage === 'about' ? 'active' : ''}
//               onClick={(e) => { e.preventDefault(); handleNavClick('about'); }}
//             >
//               <FaInfoCircle /> About
//             </a>
//           </li>
//           <li>
//             <a 
//               href="#contact" 
//               className={currentPage === 'contact' ? 'active' : ''}
//               onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
//             >
//               <FaEnvelope /> Contact
//             </a>
//           </li>
//           <li>
//             <a 
//               href="#admin" 
//               className={currentPage === 'admin' ? 'active' : ''}
//               onClick={handleAdminClick}
//             >
//               <FaCog /> {isAdminLoggedIn ? 'Admin' : 'Login'}
//             </a>
//           </li>
//           {isAdminLoggedIn && (
//             <li className="logout-item">
//               <a 
//                 href="#logout" 
//                 onClick={(e) => { e.preventDefault(); handleLogout(); }}
//                 className="logout-link"
//               >
//                 <FaSignOutAlt /> Logout
//               </a>
//             </li>
//           )}
//         </ul>
//       </nav>

//       {isOpen && <div className="overlay" onClick={() => setIsOpen(false)}></div>}
//     </>
//   );
// }

// export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaImages, FaInfoCircle, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
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
            <img 
              src="/assets/staticwebsite.png" 
              alt="kameshfineart" 
              className="logo-image"
            />
            {/* <span className="logo-tagline">FRAMING MEMORIES FOREVER</span> */}
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