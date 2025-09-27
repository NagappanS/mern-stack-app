import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/API";
import "./Login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login Successful");
      if (res.data.user.role === "admin") navigate("/admin/dashboard");
      else navigate("/restaurants");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
         <img src="../assets/JOY.png" alt="Logo" className="logo" />
        <h2>Welcome Back 👋</h2>
        <p>
          Today is a new day, It’s your day, You shape it<br />
          Sign in to Enjoy Your Food
        </p>
        <form onSubmit={handleSubmit}>
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
          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn-primary">Sign in</button>
        </form>

        <div className="divider">Or</div>

        <button className="btn-google">Sign in with Google</button>
        <button className="btn-facebook">Sign in with Facebook</button>

        <p className="signup-text">
          Don’t you have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>

      <div className="login-image"></div>
    </div>
  );
};

export default Login;
