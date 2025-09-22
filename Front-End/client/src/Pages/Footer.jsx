// src/components/Footer.jsx
import { FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
          <a href="https://wa.me/918667496870" target="_blank" rel="noreferrer"><FaWhatsapp /></a>
        </div>

        <div className="contact">
          Contact: +91 8667496870
        </div>

        <div className="logo-cta" onClick={() => window.location.href = "/restaurants"}>
          <img src="../assets/JOY.png" alt="Logo" />
        </div>

        <p className="copyright">&copy; {new Date().getFullYear()} JOY SPOON. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
