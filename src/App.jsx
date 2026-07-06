// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Login from './components/Login';
import Loading from './components/Loading';
import ToastProvider from './components/ToastProvider';
import SEO from './components/SEO';
import useImages from '../src/utils/useImages';
import './App.css';

// 🔒 Protected Route Component
const ProtectedRoute = ({ children, isAdminLoggedIn }) => {
  const location = useLocation();
  
  if (!isAdminLoggedIn) {
    // Redirect to login page and save the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// 🔓 Public Route (redirects to admin if already logged in)
const PublicRoute = ({ children, isAdminLoggedIn }) => {
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

function App() {
  const { images, loading, addImageFromFile, addImageFromUrl, removeImage, clearAllImages } = useImages();
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
    // Only allow navigation if logged in OR going to home/login
    if (!isAdminLoggedIn && page !== 'home' && page !== 'login') {
      navigate('/login');
      return;
    }
    
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
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsAdminLoggedIn(false);
    navigate('/login');
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
            {/* 🔓 Public Routes - Only accessible when NOT logged in */}
            <Route path="/login" element={
              <PublicRoute isAdminLoggedIn={isAdminLoggedIn}>
                <Login onLogin={handleLogin} />
              </PublicRoute>
            } />
            
            {/* 🔒 Protected Routes - Only accessible when logged in */}
            <Route path="/" element={
              <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                <Home images={images} setCurrentPage={handlePageChange} />
              </ProtectedRoute>
            } />
            
            <Route path="/home" element={
              <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                <Home images={images} setCurrentPage={handlePageChange} />
              </ProtectedRoute>
            } />
            
            <Route path="/gallery" element={
              <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                <Gallery images={images} />
              </ProtectedRoute>
            } />
            
            <Route path="/about" element={
              <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                <About imageCount={images.length} />
              </ProtectedRoute>
            } />
            
            <Route path="/contact" element={
              <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                <Contact />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute isAdminLoggedIn={isAdminLoggedIn}>
                <Admin 
                  images={images} 
                  addImageFromFile={addImageFromFile}
                  addImageFromUrl={addImageFromUrl}
                  deleteImage={removeImage}
                  onLogout={handleLogout}
                />
              </ProtectedRoute>
            } />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
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