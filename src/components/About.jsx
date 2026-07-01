import React from 'react';
import BackButton from './BackButton';
import './About.css';

function About({ imageCount }) {
  return (
    <section className="page">
      {/* <BackButton onClick={() => window.history.back()} label="Back to Home" /> */}
      <h2 className="page-title">About the Artist</h2>
      <div className="about-content">
        <p>
          I'm a visual artist based in the Pacific Northwest, working with 
          photography and digital media. My work explores the interplay of 
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
  );
}

export default About;