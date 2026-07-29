// import { Helmet } from "react-helmet-async";

// export default function SEO({
//   title = "Kamesh Fine Art | Original Paintings, Portraits & Photography",
//   description = "Explore Kamesh Fine Art – original paintings, realistic portraits, sketches and fine art photography. View the latest artworks and creative portfolio.",
//   keywords = "Kamesh Fine Art, Kamesh, Fine Art, Artist, Paintings, Portraits, Sketches, Photography, Art Gallery, Chennai Artist",
//   image = "https://www.kameshfineart.com/assets/og-image.jpg",
//   url = "https://www.kameshfineart.com/",
//   type = "website",
// }) {
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Person",
//     name: "Kamesh",
//     alternateName: "Kamesh Fine Art",
//     url: "https://www.kameshfineart.com/",
//     image: image,
//     jobTitle: "Visual Artist",
//     description,
//     sameAs: [
//       "https://www.instagram.com/urbaninkpen",
//       "https://www.behance.net/kameshfineart",
//       "https://www.linkedin.com/in/kamesh-p-a89abb267"
//     ]
//   };

//   return (
//     <Helmet>

//       <html lang="en" />

//       <title>{title}</title>

//       <meta name="description" content={description} />

//       <meta name="keywords" content={keywords} />

//       <meta
//         name="robots"
//         content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
//       />

//       <link rel="canonical" href={url} />

//       {/* Open Graph */}

//       <meta property="og:type" content={type} />

//       <meta property="og:url" content={url} />

//       <meta property="og:title" content={title} />

//       <meta property="og:description" content={description} />

//       <meta property="og:image" content={image} />

//       <meta property="og:site_name" content="Kamesh Fine Art" />

//       {/* Twitter */}

//       <meta name="twitter:card" content="summary_large_image" />

//       <meta name="twitter:title" content={title} />

//       <meta name="twitter:description" content={description} />

//       <meta name="twitter:image" content={image} />

//       {/* Theme */}

//       <meta name="theme-color" content="#000000" />

//       {/* Favicon */}

//       <link rel="icon" href="/favicon.ico" />

//       {/* JSON LD */}

//       <script type="application/ld+json">
//         {JSON.stringify(schema)}
//       </script>

//     </Helmet>
//   );
// }
import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "Kamesh Fine Art | Original Paintings, Portraits & Photography",
  description = "Kamesh Fine Art - Original paintings, realistic portraits, sketches and fine art photography by artist Kamesh from Chennai, Tamil Nadu, India.",
  keywords = "Kamesh Fine Art, Kamesh artist, Kamesh paintings, Kamesh portraits, Kamesh sketches, Kamesh photography, original art, fine art, Chennai artist, Tamil Nadu art",
  image = "https://www.kameshfineart.com/assets/og-image.jpg",
  url = "https://www.kameshfineart.com/",
  type = "website",
  page = "home",
  publishedTime = null,
  modifiedTime = null,
  noindex = false,
}) {
  // ===== ROBOTS =====
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    'follow',
    'max-image-preview:large',
    'max-snippet:-1',
    'max-video-preview:-1'
  ].filter(Boolean).join(', ');

  // ===== ABSOLUTE IMAGE URL =====
  const imageUrl = image.startsWith('https') ? image : `https://www.kameshfineart.com${image}`;

  // ===== SCHEMA BUILDER =====
  const schemas = [];

  // 1. ORGANIZATION SCHEMA
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kamesh Fine Art",
    "alternateName": "Kamesh Fine Art Studio",
    "description": description,
    "url": url,
    "logo": "https://www.kameshfineart.com/assets/logo.png",
    "image": imageUrl,
    "email": "kameshfineart@gmail.com",
    "telephone": "+919345933994",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "India"
    },
    "sameAs": [
      "https://www.instagram.com/urbaninkpen",
      "https://www.behance.net/kameshfineart",
      "https://www.linkedin.com/in/kamesh-p-a89abb267"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+919345933994",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Tamil"],
      "areaServed": "Worldwide"
    },
    "founder": {
      "@type": "Person",
      "name": "Kamesh",
      "jobTitle": "Visual Artist & Photographer"
    }
  });

  // 2. PERSON / ARTIST SCHEMA
  schemas.push({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Kamesh",
    "alternateName": "Kamesh Fine Art",
    "description": "Visual artist and photographer based in Chennai, Tamil Nadu, India. Specializing in original paintings, realistic portraits, sketches and fine art photography.",
    "url": url,
    "image": imageUrl,
    "jobTitle": "Visual Artist & Photographer",
    "worksFor": {
      "@type": "Organization",
      "name": "Kamesh Fine Art"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "India"
    },
    "sameAs": [
      "https://www.instagram.com/urbaninkpen",
      "https://www.behance.net/kameshfineart",
      "https://www.linkedin.com/in/kamesh-p-a89abb267"
    ],
    "nationality": {
      "@type": "Country",
      "name": "India"
    },
    "birthPlace": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Chennai",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "India"
      }
    }
  });

  // 3. WEBSITE SCHEMA
  schemas.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Kamesh Fine Art",
    "alternateName": "Kamesh Fine Art Studio",
    "url": url,
    "description": description,
    "inLanguage": "en-US",
    "about": {
      "@type": "Thing",
      "name": "Fine Art, Paintings, Portraits, Photography"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${url}search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  });

  // 4. IMAGE GALLERY SCHEMA
  if (page === 'gallery') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": "Kamesh Fine Art Gallery",
      "description": "Original paintings, realistic portraits, sketches and fine art by artist Kamesh.",
      "url": `${url}gallery`,
      "author": {
        "@type": "Person",
        "name": "Kamesh",
        "url": url
      },
      "about": {
        "@type": "Thing",
        "name": "Fine Art Collection"
      },
      "inLanguage": "en-US"
    });
  }

  // 5. COLLECTION PAGE SCHEMA
  if (page === 'gallery') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Kamesh Fine Art Gallery",
      "description": "Browse original paintings, portraits, sketches and fine art by artist Kamesh.",
      "url": `${url}gallery`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Kamesh Fine Art",
        "url": url
      },
      "about": {
        "@type": "Thing",
        "name": "Fine Art Collection"
      }
    });
  }

  // 6. BREADCRUMB SCHEMA
  const breadcrumbItems = [
    { position: 1, name: "Home", item: url }
  ];

  if (page === 'gallery') {
    breadcrumbItems.push({ position: 2, name: "Gallery", item: `${url}gallery` });
  } else if (page === 'photography') {
    breadcrumbItems.push({ position: 2, name: "Photography", item: `${url}photography` });
  } else if (page === 'about') {
    breadcrumbItems.push({ position: 2, name: "About", item: `${url}about` });
  } else if (page === 'contact') {
    breadcrumbItems.push({ position: 2, name: "Contact", item: `${url}contact` });
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.item
    }))
  });

  // 7. CONTACT PAGE SCHEMA
  if (page === 'contact') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Kamesh Fine Art",
      "description": "Get in touch with Kamesh Fine Art for art commissions, inquiries or collaborations.",
      "url": `${url}contact`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Kamesh Fine Art",
        "url": url
      }
    });
  }

  // 8. ABOUT PAGE SCHEMA
  if (page === 'about') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Kamesh Fine Art",
      "description": "Learn about artist Kamesh, his artistic journey, creative style and inspiration.",
      "url": `${url}about`,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Kamesh Fine Art",
        "url": url
      },
      "mainEntity": {
        "@type": "Person",
        "name": "Kamesh",
        "description": "Visual artist and photographer based in Chennai, Tamil Nadu, India."
      }
    });
  }

  // 9. ARTICLE SCHEMA
  if (publishedTime) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": imageUrl,
      "author": {
        "@type": "Person",
        "name": "Kamesh",
        "url": url
      },
      "publisher": {
        "@type": "Organization",
        "name": "Kamesh Fine Art",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.kameshfineart.com/assets/logo.png"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    });
  }

  return (
    <Helmet>
      {/* ===== HTML LANGUAGE ===== */}
      <html lang="en" />

      {/* ===== TITLE ===== */}
      <title>{title}</title>

      {/* ===== DESCRIPTION ===== */}
      <meta name="description" content={description} />

      {/* ===== KEYWORDS ===== */}
      <meta name="keywords" content={keywords} />

      {/* ===== ROBOTS ===== */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />

      {/* ===== CANONICAL ===== */}
      <link rel="canonical" href={url} />

      {/* ===== OPEN GRAPH ===== */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content="Kamesh Fine Art" />
      <meta property="og:locale" content="en_US" />

      {/* ===== TWITTER CARD ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@urbaninkpen" />
      <meta name="twitter:creator" content="@urbaninkpen" />

      {/* ===== THEME ===== */}
      <meta name="theme-color" content="#1c1c1c" />

      {/* ===== FAVICON ===== */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

      {/* ===== JSON-LD SCHEMAS ===== */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}