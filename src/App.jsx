// // import React, { useState, useEffect } from 'react';
// // import { Helmet } from 'react-helmet-async';
// // import Navbar from './components/Navbar';
// // import Home from './components/Home';
// // import Gallery from './components/Gallery';
// // import About from './components/About';
// // import Contact from './components/Contact';
// // import Admin from './components/Admin';
// // import Login from './components/Login';
// // import BackButton from './components/BackButton';
// // import Loading from './components/Loading';
// // import SEO from './components/SEO';
// // import useLocalStorage from './hooks/useLocalStorage';
// // import initialImages from './data/initialImages';
// // import './App.css';

// // function App() {
// //   const [images, setImages] = useLocalStorage('galleryImages', initialImages);
// //   const [currentPage, setCurrentPage] = useState('home');
// //   const [pageHistory, setPageHistory] = useState(['home']);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

// //   // Check admin login status on mount
// //   useEffect(() => {
// //     const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
// //     const loginTime = localStorage.getItem('adminLoginTime');
    
// //     if (loggedIn && loginTime) {
// //       const timeDiff = Date.now() - parseInt(loginTime);
// //       const hoursDiff = timeDiff / (1000 * 60 * 60);
      
// //       if (hoursDiff < 24) {
// //         setIsAdminLoggedIn(true);
// //       } else {
// //         localStorage.removeItem('isAdminLoggedIn');
// //         localStorage.removeItem('adminLoginTime');
// //         setIsAdminLoggedIn(false);
// //       }
// //     }
// //   }, []);

// //   const handlePageChange = (page) => {
// //     setIsLoading(true);
// //     setCurrentPage(page);
// //     setPageHistory(prev => [...prev, page]);
    
// //     setTimeout(() => {
// //       setIsLoading(false);
// //     }, 600);
// //   };

// //   const handleBack = () => {
// //     if (pageHistory.length > 1) {
// //       setIsLoading(true);
// //       const newHistory = [...pageHistory];
// //       newHistory.pop();
// //       const previousPage = newHistory[newHistory.length - 1];
// //       setPageHistory(newHistory);
// //       setCurrentPage(previousPage);
      
// //       setTimeout(() => {
// //         setIsLoading(false);
// //       }, 600);
// //     }
// //   };

// //   const handleLogin = (status) => {
// //     setIsAdminLoggedIn(status);
// //     if (status) {
// //       setCurrentPage('admin');
// //       setPageHistory(prev => [...prev, 'admin']);
// //     } else {
// //       setCurrentPage('home');
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem('isAdminLoggedIn');
// //     localStorage.removeItem('adminLoginTime');
// //     setIsAdminLoggedIn(false);
// //     setCurrentPage('home');
// //     setPageHistory(['home']);
// //   };

// //   const addImage = (url, title) => {
// //     const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
// //     setImages([...images, { id: newId, url, title, timestamp: Date.now() }]);
// //   };

// //   const deleteImage = (id) => {
// //     setImages(images.filter(img => img.id !== id));
// //   };

// //   const showBackButton = currentPage !== 'home';

// //   const getSEOData = () => {
// //     const baseUrl = 'https://framora.com';
    
// //     switch(currentPage) {
// //       case 'home':
// //         return {
// //           title: 'FRAMORA - Art Studio & Photography Portfolio',
// //           description: 'Explore stunning art and photography by FRAMORA. Capturing moments, creating stories through visual art and creative expression.',
// //           keywords: 'art, photography, portfolio, artist, gallery, visual art, framora, creative',
// //           url: baseUrl
// //         };
// //       case 'gallery':
// //         return {
// //           title: 'Gallery - FRAMORA Art Portfolio',
// //           description: 'Browse through our collection of stunning art and photography. Each piece tells a unique story through visual expression.',
// //           keywords: 'art gallery, photography gallery, portfolio, artwork, visual art, framora gallery',
// //           url: `${baseUrl}/gallery`
// //         };
// //       case 'about':
// //         return {
// //           title: 'About the Artist - FRAMORA',
// //           description: 'Learn about the artist behind FRAMORA. A visual artist based in the Pacific Northwest, working with photography and digital media.',
// //           keywords: 'artist bio, visual artist, photographer, digital artist, about framora',
// //           url: `${baseUrl}/about`
// //         };
// //       case 'contact':
// //         return {
// //           title: 'Contact - FRAMORA Art Studio',
// //           description: 'Get in touch with FRAMORA for commissions, collaborations, or just to say hello. We\'d love to hear from you.',
// //           keywords: 'contact artist, art commissions, photography booking, framora contact',
// //           url: `${baseUrl}/contact`
// //         };
// //       case 'admin':
// //         return {
// //           title: 'Admin Panel - FRAMORA',
// //           description: 'Manage your gallery, add new artwork, and update your portfolio.',
// //           keywords: 'admin, manage gallery, upload art, portfolio management',
// //           url: `${baseUrl}/admin`
// //         };
// //       default:
// //         return {
// //           title: 'FRAMORA - Art Studio',
// //           description: 'Art and photography portfolio',
// //           keywords: 'art, photography, portfolio',
// //           url: baseUrl
// //         };
// //     }
// //   };

// //   const seoData = getSEOData();

// //   // Show login page when accessing admin without login
// //   if (currentPage === 'admin' && !isAdminLoggedIn) {
// //     return (
// //       <div className="app">
// //         <Helmet>
// //           <title>Admin Login - FRAMORA</title>
// //         </Helmet>
// //         <Navbar 
// //           currentPage={currentPage} 
// //           setCurrentPage={handlePageChange}
// //           isAdminLoggedIn={isAdminLoggedIn}
// //           onLogout={handleLogout}
// //         />
// //         <main className="container">
// //           <Login onLogin={handleLogin} />
// //         </main>
// //         <footer className="footer">
// //           <p>© 2026 FRAMORA · built with React</p>
// //         </footer>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="app">
// //       <Helmet>
// //         <html lang="en" />
// //         <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
// //       </Helmet>
      
// //       <SEO 
// //         title={seoData.title}
// //         description={seoData.description}
// //         keywords={seoData.keywords}
// //         url={seoData.url}
// //       />

// //       <Navbar 
// //         currentPage={currentPage} 
// //         setCurrentPage={handlePageChange}
// //         isAdminLoggedIn={isAdminLoggedIn}
// //         onLogout={handleLogout}
// //       />
      
// //       <main className="container">
// //         {isLoading ? (
// //           <Loading type="page" />
// //         ) : (
// //           <>
// //             {showBackButton && (
// //               <BackButton onClick={handleBack} label="Back" />
// //             )}
            
// //             {currentPage === 'home' && (
// //               <Home images={images} setCurrentPage={handlePageChange} />
// //             )}
            
// //             {currentPage === 'gallery' && (
// //               <Gallery images={images} />
// //             )}
            
// //             {currentPage === 'about' && (
// //               <About imageCount={images.length} />
// //             )}
            
// //             {currentPage === 'contact' && (
// //               <Contact />
// //             )}
            
// //             {currentPage === 'admin' && isAdminLoggedIn && (
// //               <Admin 
// //                 images={images} 
// //                 addImage={addImage} 
// //                 deleteImage={deleteImage}
// //                 onLogout={handleLogout}
// //               />
// //             )}
// //           </>
// //         )}
// //       </main>
      
// //       <footer className="footer">
// //         <p>© 2026 FRAMORA · built with React</p>
// //       </footer>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState, useEffect } from 'react';
// import { Helmet } from 'react-helmet-async';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import Gallery from './components/Gallery';
// import About from './components/About';
// import Contact from './components/Contact';
// import Admin from './components/Admin';
// import Login from './components/Login';
// import Loading from './components/Loading';
// import SEO from './components/SEO';
// import useLocalStorage from './hooks/useLocalStorage';
// import initialImages from './data/initialImages';
// import './App.css';

// function App() {
//   const [images, setImages] = useLocalStorage('galleryImages', initialImages);
//   const [currentPage, setCurrentPage] = useState('home');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

//   // Check admin login status on mount
//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
//     const loginTime = localStorage.getItem('adminLoginTime');
    
//     if (loggedIn && loginTime) {
//       const timeDiff = Date.now() - parseInt(loginTime);
//       const hoursDiff = timeDiff / (1000 * 60 * 60);
      
//       if (hoursDiff < 24) {
//         setIsAdminLoggedIn(true);
//       } else {
//         localStorage.removeItem('isAdminLoggedIn');
//         localStorage.removeItem('adminLoginTime');
//         setIsAdminLoggedIn(false);
//       }
//     }
//   }, []);

//   const handlePageChange = (page) => {
//     setIsLoading(true);
//     setCurrentPage(page);
    
//     setTimeout(() => {
//       setIsLoading(false);
//     }, 600);
//   };

//   const handleLogin = (status) => {
//     setIsAdminLoggedIn(status);
//     if (status) {
//       setCurrentPage('admin');
//     } else {
//       setCurrentPage('home');
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('isAdminLoggedIn');
//     localStorage.removeItem('adminLoginTime');
//     setIsAdminLoggedIn(false);
//     setCurrentPage('home');
//   };

//   const addImage = (url, title) => {
//     const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
//     setImages([...images, { id: newId, url, title, timestamp: Date.now() }]);
//   };

//   const deleteImage = (id) => {
//     setImages(images.filter(img => img.id !== id));
//   };

//   const getSEOData = () => {
//     const baseUrl = 'https://framora.com';
    
//     switch(currentPage) {
//       case 'home':
//         return {
//           title: 'FRAMORA - Art Studio & Photography Portfolio',
//           description: 'Explore stunning art and photography by FRAMORA. Capturing moments, creating stories through visual art and creative expression.',
//           keywords: 'art, photography, portfolio, artist, gallery, visual art, framora, creative',
//           url: baseUrl
//         };
//       case 'gallery':
//         return {
//           title: 'Gallery - FRAMORA Art Portfolio',
//           description: 'Browse through our collection of stunning art and photography. Each piece tells a unique story through visual expression.',
//           keywords: 'art gallery, photography gallery, portfolio, artwork, visual art, framora gallery',
//           url: `${baseUrl}/gallery`
//         };
//       case 'about':
//         return {
//           title: 'About the Artist - FRAMORA',
//           description: 'Learn about the artist behind FRAMORA. A visual artist based in the Pacific Northwest, working with photography and digital media.',
//           keywords: 'artist bio, visual artist, photographer, digital artist, about framora',
//           url: `${baseUrl}/about`
//         };
//       case 'contact':
//         return {
//           title: 'Contact - FRAMORA Art Studio',
//           description: 'Get in touch with FRAMORA for commissions, collaborations, or just to say hello. We\'d love to hear from you.',
//           keywords: 'contact artist, art commissions, photography booking, framora contact',
//           url: `${baseUrl}/contact`
//         };
//       case 'admin':
//         return {
//           title: 'Admin Panel - FRAMORA',
//           description: 'Manage your gallery, add new artwork, and update your portfolio.',
//           keywords: 'admin, manage gallery, upload art, portfolio management',
//           url: `${baseUrl}/admin`
//         };
//       default:
//         return {
//           title: 'FRAMORA - Art Studio',
//           description: 'Art and photography portfolio',
//           keywords: 'art, photography, portfolio',
//           url: baseUrl
//         };
//     }
//   };

//   const seoData = getSEOData();

//   // Show login page when accessing admin without login
//   if (currentPage === 'admin' && !isAdminLoggedIn) {
//     return (
//       <div className="app">
//         <Helmet>
//           <title>Admin Login - FRAMORA</title>
//         </Helmet>
//         <Navbar 
//           currentPage={currentPage} 
//           setCurrentPage={handlePageChange}
//           isAdminLoggedIn={isAdminLoggedIn}
//           onLogout={handleLogout}
//         />
//         <main className="container">
//           <Login onLogin={handleLogin} />
//         </main>
//         <footer className="footer">
//           <p>© 2026 FRAMORA · built with React</p>
//         </footer>
//       </div>
//     );
//   }

//   return (
//     <div className="app">
//       <Helmet>
//         <html lang="en" />
//         <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
//       </Helmet>
      
//       <SEO 
//         title={seoData.title}
//         description={seoData.description}
//         keywords={seoData.keywords}
//         url={seoData.url}
//       />

//       <Navbar 
//         currentPage={currentPage} 
//         setCurrentPage={handlePageChange}
//         isAdminLoggedIn={isAdminLoggedIn}
//         onLogout={handleLogout}
//       />
      
//       <main className="container">
//         {isLoading ? (
//           <Loading type="page" />
//         ) : (
//           <>
//             {currentPage === 'home' && (
//               <Home images={images} setCurrentPage={handlePageChange} />
//             )}
            
//             {currentPage === 'gallery' && (
//               <Gallery images={images} />
//             )}
            
//             {currentPage === 'about' && (
//               <About imageCount={images.length} />
//             )}
            
//             {currentPage === 'contact' && (
//               <Contact />
//             )}
            
//             {currentPage === 'admin' && isAdminLoggedIn && (
//               <Admin 
//                 images={images} 
//                 addImage={addImage} 
//                 deleteImage={deleteImage}
//                 onLogout={handleLogout}
//               />
//             )}
//           </>
//         )}
//       </main>
      
//       <footer className="footer">
//         <p>© 2026 FRAMORA · built with React</p>
//       </footer>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import useLocalStorage from './hooks/useLocalStorage';
import initialImages from './data/initialImages';
import './App.css';

function App() {
  const [images, setImages] = useLocalStorage('galleryImages', initialImages);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'home';

  // Check admin login status on mount
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

  const addImage = (url, title) => {
    const newId = images.length > 0 ? Math.max(...images.map(img => img.id)) + 1 : 1;
    setImages([...images, { id: newId, url, title, timestamp: Date.now() }]);
  };

  const deleteImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const getSEOData = () => {
    const baseUrl = 'https://framora.com';
    
    switch(currentPage) {
      case 'home':
        return {
          title: 'FRAMORA - Art Studio & Photography Portfolio',
          description: 'Explore stunning art and photography by FRAMORA. Capturing moments, creating stories through visual art and creative expression.',
          keywords: 'art, photography, portfolio, artist, gallery, visual art, framora, creative',
          url: baseUrl
        };
      case 'gallery':
        return {
          title: 'Gallery - FRAMORA Art Portfolio',
          description: 'Browse through our collection of stunning art and photography. Each piece tells a unique story through visual expression.',
          keywords: 'art gallery, photography gallery, portfolio, artwork, visual art, framora gallery',
          url: `${baseUrl}/gallery`
        };
      case 'about':
        return {
          title: 'About the Artist - FRAMORA',
          description: 'Learn about the artist behind FRAMORA. A visual artist based in the Pacific Northwest, working with photography and digital media.',
          keywords: 'artist bio, visual artist, photographer, digital artist, about framora',
          url: `${baseUrl}/about`
        };
      case 'contact':
        return {
          title: 'Contact - FRAMORA Art Studio',
          description: 'Get in touch with FRAMORA for commissions, collaborations, or just to say hello. We\'d love to hear from you.',
          keywords: 'contact artist, art commissions, photography booking, framora contact',
          url: `${baseUrl}/contact`
        };
      case 'admin':
        return {
          title: 'Admin Panel - FRAMORA',
          description: 'Manage your gallery, add new artwork, and update your portfolio.',
          keywords: 'admin, manage gallery, upload art, portfolio management',
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

  // If trying to access admin without login, show login
  if (currentPage === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="app">
        <Helmet>
          <title>Admin Login - FRAMORA</title>
        </Helmet>
        <Navbar 
          currentPage={currentPage} 
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
        currentPage={currentPage} 
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
            <Route path="/about" element={<About imageCount={images.length} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={
              isAdminLoggedIn ? (
                <Admin 
                  images={images} 
                  addImage={addImage} 
                  deleteImage={deleteImage}
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
        <p>© 2026 FRAMORA · built with React</p>
      </footer>
    </div>
  );
}

export default App;