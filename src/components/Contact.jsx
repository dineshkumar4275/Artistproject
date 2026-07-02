import React from 'react';
import BackButton from './BackButton';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaLinkedin } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  return (
    <section className="page">
      <BackButton onClick={() => window.history.back()} label="Back to Home" />
      <h2 className="page-title">Contact</h2>
      <div className="contact-card">
        {/* Email - Click to open mail app */}
        <p>
          <FaEnvelope /> 
          <a href="mailto:kameshfineart@gmail.com" className="contact-link">
            kameshfineart@gmail.com
          </a>
        </p>
        
        {/* Phone - Click to call */}
        <p>
          <FaPhone /> 
          <a href="tel:+919345933994" className="contact-link">
            +91 93459 33994
          </a>
        </p>
        
        {/* Address */}
        <p>
          <FaMapMarkerAlt /> Chennai, Tamil Nadu
        </p>
        
        {/* Social Links */}
        <div className="social-links">
          <a 
            href="https://www.instagram.com/urbaninkpen?igsh=MTlwbDgzdDgxd2xyMQ%3D%3D&utm_source=qr" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.behance.net/kameshfineart" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Behance"
          >
            <FaBehance />
          </a>
          <a 
            href="https://www.linkedin.com/in/kamesh-p-a89abb267?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
        
        {/* Additional Info */}
        <div className="contact-note">
          <p>📬 Feel free to reach out for collaborations or inquiries!</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;