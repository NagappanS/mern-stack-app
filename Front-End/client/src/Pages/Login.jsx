import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/API";
import { signInWithGoogle } from "../Firebase";
import "./Login.css";

const Login = ({onLogin} ) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      const { token, user } = res.data;

      // Save in App state via callback
      onLogin(token, user.role,user.name);

      localStorage.setItem("name", user.name); // still store username
      localStorage.setItem("deliverymanId", user._id); // store deliverymanId if needed

      alert("Login successful");

      // Redirect
      navigate(user.role === "admin" ? "/admin" : 
      (user.role === "delivery" ? "/delivery" :(
      user.role === "user" ? "/restaurants" :
      "/login")), { replace: true });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Login failed");
    }
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const { user, token } = await signInWithGoogle();

      // You can send this token to backend for verification or create user entry
      const res = await API.post("/auth/google-login", {
        email: user.email,
        name: user.displayName,
        googleId: user.uid,
      });

      const { token: backendToken, user: dbUser } = res.data;

      onLogin(backendToken, dbUser.role, dbUser.name);
      localStorage.setItem("name", dbUser.name);
      localStorage.setItem("deliverymanId", dbUser._id);
      alert(`Welcome, ${dbUser.name}!`);

      navigate(dbUser.role === "admin" ? "/admin" : 
      (dbUser.role === "delivery" ? "/delivery" :(
      dbUser.role === "user" ? "/restaurants" :
      "/login")), { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google sign-in failed");
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

        {/* ✅ Google Login Button */}
        <button className="btn-google" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            style={{ width: "20px", marginRight: "8px" }}
          />
          Sign in with Google
        </button>


        <p className="signup-text">
          Don’t you have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>

      <div className="login-image"></div>
    </div>
  );
};

export default Login;
