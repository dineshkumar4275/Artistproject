import React from 'react';
import { Helmet } from 'react-helmet-async';

function SEO({ 
  title = 'kameshfineart - Art Studio & Photography Portfolio',
  description = 'Explore stunning art and photography by kameshfineart. Capturing moments, creating stories through visual art and creative expression.',
  keywords = 'art, photography, portfolio, artist, gallery, visual art, kameshfineart, fine art, digital art, paintings, sketches, art prints, photography portfolio',
  image = '/assets/og-image.jpg',
  url = 'https://kameshfineart.com',
  author = 'kameshfineart',
  type = 'website',
  publishedTime = null,
  modifiedTime = null
}) {
  return (
    <Helmet>
      {/* ===== BASIC META TAGS ===== */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
      
      {/* ===== OPEN GRAPH / FACEBOOK ===== */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="kameshfineart" />
      <meta property="og:locale" content="en_US" />
      
      {/* ===== TWITTER CARD ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@kameshfineart" />
      <meta name="twitter:creator" content="@kameshfineart" />

      {/* ===== ADDITIONAL SEO ===== */}
      <meta name="theme-color" content="#1c1c1c" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* ===== STRUCTURED DATA / JSON-LD ===== */}
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "kameshfineart",
          "description": description,
          "url": url,
          "logo": `${url}/assets/logo.png`,
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
          }
        })}
      </script>

      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "kameshfineart",
          "url": url,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${url}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>

      {/* Image Gallery Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ImageGallery",
          "name": "kameshfineart Art Gallery",
          "description": description,
          "url": `${url}/gallery`,
          "author": {
            "@type": "Person",
            "name": "kameshfineart",
            "url": url
          }
        })}
      </script>

      {/* Person/Artist Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "kameshfineart",
          "description": "Visual artist and photographer based in Chennai, Tamil Nadu",
          "url": url,
          "sameAs": [
            "https://www.instagram.com/urbaninkpen",
            "https://www.behance.net/kameshfineart"
          ],
          "jobTitle": "Visual Artist & Photographer",
          "worksFor": {
            "@type": "Organization",
            "name": "kameshfineart Studio"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Chennai",
            "addressRegion": "Tamil Nadu",
            "addressCountry": "India"
          }
        })}
      </script>

      {/* Article/Blog Post Schema (if publishedTime is provided) */}
      {publishedTime && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
              "@type": "Person",
              "name": author,
              "url": url
            },
            "publisher": {
              "@type": "Organization",
              "name": "kameshfineart",
              "logo": {
                "@type": "ImageObject",
                "url": `${url}/assets/logo.png`
              }
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime
          })}
        </script>
      )}
    </Helmet>
  );
}

export default SEO;