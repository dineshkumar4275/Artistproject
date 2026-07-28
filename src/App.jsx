import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';

// Components
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

// Hooks & API
import { getImages, getPhotographyImages, deleteImage, deletePhotographyImage, uploadImageByUrl } from './services/api';
import showToast from './utils/toastConfig';
import './App.css';

// ===== PAGE TRANSITION VARIANTS =====
const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

// Different transitions for different pages
const pageTransitions = {
  home: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  gallery: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  photography: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  about: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
    transition: { duration: 0.5, ease: "easeInOut" }
  },
  contact: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  admin: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.4, ease: "easeInOut" }
  }
};

// Page wrapper with transition
const PageWrapper = ({ children, route }) => {
  const variant = pageTransitions[route] || pageTransitions.home;
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variant}
      className="page-transition-wrapper"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [photographyImages, setPhotographyImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isPageLoading, setIsPageLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Load images
  const loadImages = async () => {
    setLoading(true);
    try {
      const [galleryData, photoData] = await Promise.all([
        getImages(),
        getPhotographyImages()
      ]);
      setGalleryImages(galleryData || []);
      setPhotographyImages(photoData || []);
    } catch (error) {
      console.error('Failed to load images:', error);
      showToast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Check admin login
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    setIsAdminLoggedIn(loggedIn);
  }, []);

  useEffect(() => {
    loadImages();
  }, []);

  // Navigation
  const handlePageChange = (page) => {
    setIsPageLoading(true);
    navigate(`/${page === 'home' ? '' : page}`);
    setCurrentPage(page);
    setTimeout(() => setIsPageLoading(false), 500);
  };

  const handleLogin = (status) => {
    setIsAdminLoggedIn(status);
    if (status) navigate('/admin');
    else navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  // Delete functions
  const handleDeleteGallery = async (id) => {
    try {
      await deleteImage(id);
      setGalleryImages(prev => prev.filter(img => img.id !== id));
      showToast.success('Gallery image deleted');
    } catch (error) {
      showToast.error('Delete failed');
    }
  };

  const handleDeletePhotography = async (id) => {
    try {
      await deletePhotographyImage(id);
      setPhotographyImages(prev => prev.filter(img => img.id !== id));
      showToast.success('Photography image deleted');
    } catch (error) {
      showToast.error('Delete failed');
    }
  };

  // Reorder handlers for drag-and-drop
  const handleReorderGallery = (newOrder) => {
    setGalleryImages(newOrder);
  };

  const handleReorderPhotography = (newOrder) => {
    setPhotographyImages(newOrder);
  };

  // Add gallery image from URL
  const addImageFromUrl = async (url, title) => {
    try {
      await uploadImageByUrl(url, title);
      showToast.success('Image added successfully');
      await loadImages();
    } catch (error) {
      showToast.error(error.message || 'Failed to add image');
      throw error;
    }
  };

  // Determine current route
  const currentRoute = location.pathname.replace('/', '') || 'home';
  const routeKey = location.pathname + location.search;

  // Loading state
  if (loading) {
    return (
      <div className="app">
        <Loading type="page" />
      </div>
    );
  }

  // Admin login screen
  if (currentRoute === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="app">
        <Navbar currentPage="admin" setCurrentPage={handlePageChange} />
        <main className="container">
          <Login onLogin={handleLogin} />
        </main>
        <ToastProvider />
        <footer className="footer">© 2026 kameshfineart</footer>
      </div>
    );
  }

  return (
    <div className="app">
      <Helmet>
        <html lang="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <SEO
        title="kameshfineart – Art & Photography"
        description="Art and photography portfolio"
        url="https://kameshfineart.com"
      />

      <Navbar
        currentPage={currentRoute}
        setCurrentPage={handlePageChange}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      <main className="container">
        {isPageLoading ? (
          <Loading type="page" />
        ) : (
          <AnimatePresence mode="wait">
            <Routes location={location} key={routeKey}>
              <Route
                path="/"
                element={
                  <PageWrapper route="home">
                    <Home
                      images={galleryImages}
                      photographyImages={photographyImages}
                      setCurrentPage={handlePageChange}
                    />
                  </PageWrapper>
                }
              />
              <Route
                path="/home"
                element={
                  <PageWrapper route="home">
                    <Home
                      images={galleryImages}
                      photographyImages={photographyImages}
                      setCurrentPage={handlePageChange}
                    />
                  </PageWrapper>
                }
              />
              <Route
                path="/gallery"
                element={
                  <PageWrapper route="gallery">
                    <Gallery images={galleryImages} />
                  </PageWrapper>
                }
              />
              <Route
                path="/photography"
                element={
                  <PageWrapper route="photography">
                    <Photography images={photographyImages} />
                  </PageWrapper>
                }
              />
              <Route
                path="/about"
                element={
                  <PageWrapper route="about">
                    <About imageCount={galleryImages.length + photographyImages.length} />
                  </PageWrapper>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageWrapper route="contact">
                    <Contact />
                  </PageWrapper>
                }
              />
              <Route
                path="/admin"
                element={
                  <PageWrapper route="admin">
                    <Admin
                      images={galleryImages}
                      photographyImages={photographyImages}
                      addImageFromUrl={addImageFromUrl}
                      deleteImage={handleDeleteGallery}
                      deletePhotographyImage={handleDeletePhotography}
                      onReorderGallery={handleReorderGallery}
                      onReorderPhotography={handleReorderPhotography}
                      refreshPhotography={loadImages}
                      onLogout={handleLogout}
                    />
                  </PageWrapper>
                }
              />
            </Routes>
          </AnimatePresence>
        )}
      </main>

      <ToastProvider />
      <footer className="footer">
        <p>© 2026 kameshfineart · All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;