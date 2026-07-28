import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "Kamesh Fine Art | Original Paintings, Portraits & Photography",
  description = "Explore Kamesh Fine Art – original paintings, realistic portraits, sketches and fine art photography. View the latest artworks and creative portfolio.",
  keywords = "Kamesh Fine Art, Kamesh, Fine Art, Artist, Paintings, Portraits, Sketches, Photography, Art Gallery, Chennai Artist",
  image = "https://www.kameshfineart.com/assets/og-image.jpg",
  url = "https://www.kameshfineart.com/",
  type = "website",
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Kamesh",
    alternateName: "Kamesh Fine Art",
    url: "https://www.kameshfineart.com/",
    image: image,
    jobTitle: "Visual Artist",
    description,
    sameAs: [
      "https://www.instagram.com/urbaninkpen",
      "https://www.behance.net/kameshfineart",
      "https://www.linkedin.com/in/kamesh-p-a89abb267"
    ]
  };

  return (
    <Helmet>

      <html lang="en" />

      <title>{title}</title>

      <meta name="description" content={description} />

      <meta name="keywords" content={keywords} />

      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      <link rel="canonical" href={url} />

      {/* Open Graph */}

      <meta property="og:type" content={type} />

      <meta property="og:url" content={url} />

      <meta property="og:title" content={title} />

      <meta property="og:description" content={description} />

      <meta property="og:image" content={image} />

      <meta property="og:site_name" content="Kamesh Fine Art" />

      {/* Twitter */}

      <meta name="twitter:card" content="summary_large_image" />

      <meta name="twitter:title" content={title} />

      <meta name="twitter:description" content={description} />

      <meta name="twitter:image" content={image} />

      {/* Theme */}

      <meta name="theme-color" content="#000000" />

      {/* Favicon */}

      <link rel="icon" href="/favicon.ico" />

      {/* JSON LD */}

      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>

    </Helmet>
  );
}