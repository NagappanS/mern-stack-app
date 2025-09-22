import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaShoppingCart, FaStore, FaClipboardList } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // state to toggle dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <header style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "#ff4d4f",
      borderRadius: 8,
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <div style={{ cursor: "pointer" }} onClick={() => navigate("/restaurants")}>
        <img
          src="../assets/Logo.jpg"
          alt="Logo"
          style={{ width: 50, height: 50, borderRadius: "50%" }}
        />
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 25, alignItems: "center", fontWeight: "bold" }}>
        <Link to="/restaurants" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
          <FaStore /> Restaurants
        </Link>
        <Link to="/cart" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
          <FaShoppingCart /> Cart
        </Link>
        <Link to="/orders" style={{ color: "#fff", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
          <FaClipboardList /> Orders
        </Link>
      </div>

      {/* User */}
      <div style={{ display: "flex", gap: 15, alignItems: "center", position: "relative" }}>
        {!token ? (
          <>
            <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "#fff", textDecoration: "none" }}>Register</Link>
          </>
        ) : (
          <div style={{ position: "relative" }}>
            <span
              style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaUserCircle /> {username}
            </span>

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                top: "35px",
                right: 0,
                background: "#fff",
                color: "#000",
                padding: 10,
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minWidth: 100,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
              }}>
                <p style={{ cursor: "pointer", margin: 0 }} onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>Profile</p>
                <p style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 5, margin: 0 }} onClick={handleLogout}>
                  Logout <FaSignOutAlt />
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
