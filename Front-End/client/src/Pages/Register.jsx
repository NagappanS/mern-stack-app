import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/API";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      alert("User Registered Successfully");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <img src="../assets/JOY.png" alt="Logo" className="logo" />
        <h2>Create Account 👤</h2>
        <p>Need Food Make a Ring to JOY SPOON</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Example@email.com"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="At least 8 characters"
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Sign up</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      <div className="register-image"></div>
    </div>
  );
};

export default Register;
