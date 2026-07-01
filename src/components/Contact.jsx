import React from 'react';
import BackButton from './BackButton';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaBehance, FaGithub } from 'react-icons/fa';
import './Contact.css';

function Contact() {
  return (
    <section className="page">
      <BackButton onClick={() => window.history.back()} label="Back to Home" />
      <h2 className="page-title">Contact</h2>
      <div className="contact-card">
        <p><FaEnvelope /> hello@artstudio.com</p>
        <p><FaPhone /> +1 (555) 123-4567</p>
        <p><FaMapMarkerAlt /> Seattle, WA</p>
        <div className="social-links">
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaBehance /></a>
          <a href="#"><FaGithub /></a>
        </div>
      </div>
    </section>
  );
}

export default Contact;