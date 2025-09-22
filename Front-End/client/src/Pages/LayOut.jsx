// src/components/Layout.jsx
// import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import './LayOut.css';

const LayOut = ({ children }) => {
  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <main style={{ flex: 1, padding: "20px" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default LayOut;
