import React from 'react';
import SEO from './SEO';
import './About.css';

function About({ imageCount }) {
  return (
    <>
    <SEO
  page="about"
  title="About Kamesh Fine Art | Artist Portfolio & Creative Journey"
  description="Learn about artist Kamesh, his artistic journey, creative style, inspiration and fine art portfolio based in Chennai, Tamil Nadu, India."
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