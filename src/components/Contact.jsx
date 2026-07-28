import React from 'react';
import SEO from './SEO';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaLinkedin } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  return (
    <>
    <SEO
  page="contact"
  title="Contact Kamesh Fine Art | Art Commissions & Inquiries"
  description="Get in touch with Kamesh Fine Art for art commissions, collaborations, inquiries or just to say hello."
  url="https://www.kameshfineart.com/contact"
/>

      <section className="page">
        <h2 className="page-title">Contact</h2>
        <div className="contact-card">
          <p>
            <FaEnvelope /> 
            <a href="mailto:kameshfineart@gmail.com" className="contact-link">
              kameshfineart@gmail.com
            </a>
          </p>
          <p>
            <FaPhone /> 
            <a href="tel:+919345933994" className="contact-link">
              +91 93459 33994
            </a>
          </p>
          <p><FaMapMarkerAlt /> Chennai, Tamil Nadu</p>
          <div className="social-links">
            <a 
              href="https://www.instagram.com/urbaninkpen" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://www.behance.net/kameshfineart" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaBehance />
            </a>
            <a 
              href="https://www.linkedin.com/in/kamesh-p-a89abb267" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          </div>
          <div className="contact-note">
            <p>📬 Feel free to reach out for collaborations or inquiries!</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;