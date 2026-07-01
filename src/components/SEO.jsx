import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEO({ 
  title = 'FRAMORA - Art Studio & Photography Portfolio',
  description = 'Explore the stunning art and photography portfolio of FRAMORA. Capturing moments, creating stories through visual art.',
  keywords = 'art, photography, portfolio, artist, gallery, visual art, framora',
  image = '/assets/og-image.jpg',
  url = 'https://framora.com',
  author = 'FRAMORA',
  type = 'website'
}) {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Social Media */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="FRAMORA" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@framora" />
      <meta name="twitter:creator" content="@framora" />

      {/* Additional SEO */}
      <meta name="theme-color" content="#1c1c1c" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FRAMORA",
          "description": description,
          "url": url,
          "logo": `${url}/assets/logo.png`,
          "sameAs": [
            "https://instagram.com/framora",
            "https://behance.net/framora",
            "https://github.com/framora"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "Customer Service",
            "availableLanguage": ["English"]
          }
        })}
      </script>

      {/* Gallery Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "FRAMORA Art Gallery",
          "description": description,
          "url": `${url}/gallery`
        })}
      </script>
    </Helmet>
  );
}

export default SEO;