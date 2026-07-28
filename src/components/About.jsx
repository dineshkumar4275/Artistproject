import React from 'react';
import SEO from './SEO';
import './About.css';

function About({ imageCount }) {
  return (
    <>
      <SEO 
        title="About the Artist - kameshfineart | Visual Artist & Photographer"
        description="Learn about kameshfineart, a visual artist and photographer based in Chennai. Discover the creative journey and artistic vision."
        keywords="artist bio, visual artist, photographer, digital artist, about kameshfineart"
        url="https://www.kameshfineart.com/about"
      />

      <section className="page">
        <h2 className="page-title">About the Artist</h2>
        <div className="about-content">
          <p>
            I'm a visual artist based in Chennai, Tamil Nadu, working with 
            traditional and digital media. My work explores the interplay of 
            light, texture, and everyday moments.
          </p>
          <p>
            This site is a living archive of my recent projects. Feel free to 
            browse the gallery and reach out through the contact page.
          </p>
          <div className="about-stats">
            <span>📸 10+ years</span>
            <span>🖼️ {imageCount} works</span>
            <span>🌎 exhibited internationally</span>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;