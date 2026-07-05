// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Photography from './components/Photography'; // ✅ Only ONE import
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Login from './components/Login';
import Loading from './components/Loading';
import ToastProvider from './components/ToastProvider';
import SEO from './components/SEO';
import useImages from './utils/useImages';
import usePhotographyImages from './utils/usePhotographyImages';
import './App.css';

function App() {
  // Gallery images (URL uploads)
  const { 
    images, 
    loading, 
    addImageFromUrl, 
    removeImage, 
    clearAllImages 
  } = useImages();
  
  // Photography images (JPG file uploads to Cloudinary)
  const { 
    photographyImages, 
    photographyLoading, 
    addPhotographyImage, 
    removePhotographyImage, 
    clearAllPhotographyImages 
  } = usePhotographyImages();
  
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentPageName = location.pathname.replace('/', '') || 'home';

  // Check admin login status
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (loggedIn && loginTime) {
      const timeDiff = Date.now() - parseInt(loginTime);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        setIsAdminLoggedIn(false);
      }
    }
  }, []);

  const handlePageChange = (page) => {
    setIsLoading(true);
    navigate(`/${page === 'home' ? '' : page}`);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const handleLogin = (status) => {
    setIsAdminLoggedIn(status);
    if (status) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  const getSEOData = () => {
    const baseUrl = 'https://framora.com';
    
    switch(currentPageName) {
      case 'home':
        return {
          title: 'FRAMORA - Art Studio & Photography Portfolio',
          description: 'Explore stunning art and photography by FRAMORA.',
          keywords: 'art, photography, portfolio, artist, gallery, visual art',
          url: baseUrl
        };
      case 'gallery':
        return {
          title: 'Gallery - FRAMORA Art Portfolio',
          description: 'Browse through our collection of stunning art and photography.',
          keywords: 'art gallery, photography gallery, portfolio, artwork',
          url: `${baseUrl}/gallery`
        };
      case 'photography':
        return {
          title: 'Photography - FRAMORA Art Studio',
          description: 'Explore stunning photography collection by FRAMORA.',
          keywords: 'photography, photo gallery, visual art, photographs',
          url: `${baseUrl}/photography`
        };
      case 'about':
        return {
          title: 'About the Artist - FRAMORA',
          description: 'Learn about the artist behind FRAMORA.',
          keywords: 'artist bio, visual artist, photographer, digital artist',
          url: `${baseUrl}/about`
        };
      case 'contact':
        return {
          title: 'Contact - FRAMORA Art Studio',
          description: 'Get in touch with FRAMORA for commissions or collaborations.',
          keywords: 'contact artist, art commissions, photography booking',
          url: `${baseUrl}/contact`
        };
      case 'admin':
        return {
          title: 'Admin Panel - FRAMORA',
          description: 'Manage your gallery and portfolio.',
          keywords: 'admin, manage gallery, upload art',
          url: `${baseUrl}/admin`
        };
      default:
        return {
          title: 'FRAMORA - Art Studio',
          description: 'Art and photography portfolio',
          keywords: 'art, photography, portfolio',
          url: baseUrl
        };
    }
  };

  const seoData = getSEOData();

  // If not logged in and trying to access admin
  if (currentPageName === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="app">
        <Helmet>
          <title>Admin Login - FRAMORA</title>
        </Helmet>
        <Navbar 
          currentPage={currentPageName} 
          setCurrentPage={handlePageChange}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleLogout}
        />
        <main className="container">
          <Login onLogin={handleLogin} />
        </main>
        <ToastProvider />
        <footer className="footer">
          <p>© 2026 FRAMORA · built with React</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app">
      <Helmet>
        <html lang="en" />
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
      </Helmet>
      
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        url={seoData.url}
      />

      <Navbar 
        currentPage={currentPageName} 
        setCurrentPage={handlePageChange}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />
      
      <main className="container">
        {isLoading ? (
          <Loading type="page" />
        ) : (
          <Routes>
            <Route path="/" element={<Home images={images} setCurrentPage={handlePageChange} />} />
            <Route path="/home" element={<Home images={images} setCurrentPage={handlePageChange} />} />
            <Route path="/gallery" element={<Gallery images={images} />} />
            {/* ✅ Photography route - uses photographyImages from hook */}
            <Route path="/photography" element={<Photography images={photographyImages} />} />
            <Route path="/about" element={<About imageCount={images.length + photographyImages.length} />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/admin" 
              element={
                isAdminLoggedIn ? (
                  <Admin 
                    images={images} 
                    addImageFromUrl={addImageFromUrl}
                    deleteImage={removeImage}
                    photographyImages={photographyImages}
                    addPhotographyImage={addPhotographyImage}
                    deletePhotographyImage={removePhotographyImage}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
          </Routes>
        )}
      </main>
      
      <ToastProvider />
      
      <footer className="footer">
        <p>© 2026 FRAMORA · built with React</p>
      </footer>
    </div>
  );
}

export default App;