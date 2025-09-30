import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaShoppingCart, FaStore, FaClipboardList } from "react-icons/fa";
import "./Header.css";

const Header = ({ onLogout,name }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout(); // call App's handleLogout
    navigate("/login", { replace: true });
  };
  // console.log(user?.name || "No user in localStorage");
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo" onClick={() => navigate("/restaurants")}>
          {/* Replace path with your logo */}
          <img src="../assets/JOY.png" alt="Logo" />
        </div>

        <nav className="nav-links">
          <Link to="/restaurants" className="nav-link">
            <FaStore className="icon" /> Restaurants
          </Link>
          <Link to="/cart" className="nav-link">
            <FaShoppingCart className="icon" /> Cart
          </Link>
          <Link to="/orders" className="nav-link">
            <FaClipboardList className="icon" /> Orders
          </Link>
        </nav>

        <div className="user-area">
          {!token ? (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Register</Link>
            </div>
          ) : (
            <div className="user-dropdown">
              <button
                className="user-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <FaUserCircle className="icon" /> <span className="username">{name}</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu" onMouseLeave={() => setDropdownOpen(false)}>
                  <p className="dropdown-item" onClick={() => { navigate("/profile"); setDropdownOpen(false); }}>Profile</p>
                  <p className="dropdown-item" onClick={handleLogout}>Logout <FaSignOutAlt className="ml" /></p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
