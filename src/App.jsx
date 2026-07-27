import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
    // Optionally persist to backend or localStorage
    // localStorage.setItem('galleryOrder', JSON.stringify(newOrder.map(img => img.id)));
  };

  const handleReorderPhotography = (newOrder) => {
    setPhotographyImages(newOrder);
    // Optionally persist to backend or localStorage
    // localStorage.setItem('photographyOrder', JSON.stringify(newOrder.map(img => img.id)));
  };

  // Add gallery image from URL (used by Admin)
  const addImageFromUrl = async (url, title) => {
    try {
      await uploadImageByUrl(url, title);
      showToast.success('Image added successfully');
      await loadImages(); // Refresh the list
    } catch (error) {
      showToast.error(error.message || 'Failed to add image');
      throw error;
    }
  };

  // Determine current route
  const currentRoute = location.pathname.replace('/', '') || 'home';

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
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  images={galleryImages}
                  photographyImages={photographyImages}
                  setCurrentPage={handlePageChange}
                />
              }
            />
            <Route
              path="/home"
              element={
                <Home
                  images={galleryImages}
                  photographyImages={photographyImages}
                  setCurrentPage={handlePageChange}
                />
              }
            />
            <Route path="/gallery" element={<Gallery images={galleryImages} />} />
            <Route path="/photography" element={<Photography images={photographyImages} />} />
            <Route path="/about" element={<About imageCount={galleryImages.length + photographyImages.length} />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/admin"
              element={
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
              }
            />
          </Routes>
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