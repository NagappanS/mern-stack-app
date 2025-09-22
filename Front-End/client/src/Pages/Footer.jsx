// src/components/Footer.jsx
import { FaInstagram, FaTwitter, FaLinkedin, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={{
      background: "#333",
      color: "#fff",
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      borderRadius:8,
      alignItems: "center",
      flexWrap: "wrap",
      position: "relative"
    }}>
      {/* Social Icons */}
      <div style={{ display: "flex", gap: 15, marginBottom: 10 }}>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram color="#fff" /></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter color="#fff" /></a>
        <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin color="#fff" /></a>
        <a href="https://wa.me/918667496870" target="_blank" rel="noreferrer"><FaWhatsapp color="#fff" /></a>
      </div>

      {/* Contact */}
      <div style={{ fontSize: 14 }}>
        Contact: +91 8667496870
      </div>

      {/* Logo at bottom-right */}
      <div style={{ position: "absolute", bottom: 10, right: 20, cursor: "pointer" }} onClick={() => window.location.href = "/restaurants"}>
        <img src="../assets/Logo.jpg" alt="Logo" style={{ width: 50, height: 50, borderRadius: "50%" }} />
      </div>

      <p style={{ width: "100%", textAlign: "center", marginTop: 40 }}>&copy; {new Date().getFullYear()} FoodieApp. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
