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
import Photography from './components/Photography'; // Import
import Login from './components/Login';
import Loading from './components/Loading';
import ToastProvider from './components/ToastProvider';
import SEO from './components/SEO';
import useImages from '../src/utils/useImages';
import usePhotographyImages from '../src/utils/usePhotographyImages';
import './App.css';

function App() {
  // Gallery images (URL uploads)
  const { images, loading, addImageFromFile, addImageFromUrl, removeImage, clearAllImages } = useImages();
  
  // Photography images (JPG file uploads)
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
    // ... existing SEO data function
  };

  const seoData = getSEOData();

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
            <Route path="/photography" element={<Photography images={photographyImages} />} />
            <Route path="/about" element={<About imageCount={images.length + photographyImages.length} />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/admin" 
              element={
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
              } 
            />
            <Route 
              path="/photography-admin" 
              element={
                isAdminLoggedIn ? (
                  <PhotographyAdmin 
                    images={photographyImages}
                    addPhotographyImage={addPhotographyImage}
                    deleteImage={removePhotographyImage}
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