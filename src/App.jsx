import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Photography from './components/Photography';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Login from './components/Login';
import Loading from './components/Loading';
import ToastProvider from './components/ToastProvider';
import SEO from './components/SEO';
import useImages from './hooks/useImages';
import './App.css';

function App() {
  const { images, loading, addImageFromFile, addImageFromUrl, removeImage, clearAllImages } = useImages();
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
    const baseUrl = 'https://kameshfineart.com';
    
    switch(currentPageName) {
      case 'home':
        return {
          title: 'kameshfineart - Art Studio & Photography Portfolio | Home',
          description: 'Welcome to kameshfineart art studio. Explore stunning paintings, digital art, and photography. Discover unique artwork and creative expressions.',
          keywords: 'art, paintings, digital art, photography, artist portfolio, kameshfineart, art studio, Chennai artist',
          url: baseUrl
        };
      case 'gallery':
        return {
          title: 'Art Gallery - kameshfineart | Paintings & Digital Art',
          description: 'Browse through the stunning art gallery of kameshfineart. View original paintings, digital artwork, and creative visual art pieces.',
          keywords: 'art gallery, paintings, digital art, artwork, kameshfineart gallery, visual art, fine art',
          url: `${baseUrl}/gallery`
        };
      case 'photography':
        return {
          title: 'Photography Portfolio - kameshfineart | Capturing Moments',
          description: 'Explore the photography portfolio of kameshfineart. Stunning images capturing moments, landscapes, portraits, and creative photography.',
          keywords: 'photography, photographer, portrait photography, landscape photography, kameshfineart photography',
          url: `${baseUrl}/photography`
        };
      case 'about':
        return {
          title: 'About the Artist - kameshfineart | Visual Artist & Photographer',
          description: 'Learn about kameshfineart, a visual artist and photographer based in Chennai. Discover the creative journey and artistic vision.',
          keywords: 'artist bio, visual artist, photographer, digital artist, about kameshfineart',
          url: `${baseUrl}/about`
        };
      case 'contact':
        return {
          title: 'Contact - kameshfineart | Get in Touch for Art & Photography',
          description: 'Get in touch with kameshfineart for art commissions, photography services, or collaborations. We\'d love to hear from you.',
          keywords: 'contact artist, art commissions, photography booking, kameshfineart contact',
          url: `${baseUrl}/contact`
        };
      case 'admin':
        return {
          title: 'Admin Panel - kameshfineart',
          description: 'Manage your gallery, add new artwork, and update your portfolio.',
          keywords: 'admin, manage gallery, upload art, portfolio management',
          url: `${baseUrl}/admin`
        };
      default:
        return {
          title: 'kameshfineart - Art Studio & Photography Portfolio',
          description: 'Art and photography portfolio',
          keywords: 'art, photography, portfolio',
          url: baseUrl
        };
    }
  };

  const seoData = getSEOData();

  if (currentPageName === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="app">
        <Helmet>
          <title>Admin Login - kameshfineart</title>
          <meta name="robots" content="noindex, nofollow" />
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
          <p>© 2026 kameshfineart · built with React</p>
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
            <Route path="/photography" element={<Photography images={images} />} />
            <Route path="/about" element={<About imageCount={images.length} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={
              isAdminLoggedIn ? (
                <Admin 
                  images={images} 
                  addImageFromFile={addImageFromFile}
                  addImageFromUrl={addImageFromUrl}
                  deleteImage={removeImage}
                  onLogout={handleLogout}
                />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } />
          </Routes>
        )}
      </main>
      
      <ToastProvider />
      
      <footer className="footer">
        <p>© 2026 kameshfineart · built with React</p>
      </footer>
    </div>
  );
}

export default App;