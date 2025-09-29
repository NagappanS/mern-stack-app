// src/pages/Restaurants.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/API";
import "./Restaurants.css";

const Restaurants = () => {
  const [rests, setRests] = useState([]);
  const [search, setSearch] = useState("");

  const getImageUrl = (img) => {
  if (img.startsWith("http")) return img;
  // API.defaults.baseURL should be set in src/api/API.js
  return `${API.defaults.baseURL}/uploads/${img}`;
};

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/restaurants");
        setRests(res.data);
      } catch (err) {
        console.error("Failed to load restaurants", err);
      }
    };
    load();
  }, []);

  const filtered = rests.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="restaurants-page">
      {/* Fullscreen Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Find Your Favorite Restaurant</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Restaurants Grid */}
      <div className="restaurants-container">
              <h2>Available Restaurants</h2>
              <div className="restaurants-grid">
                {filtered.map((r) => (
                  <div key={r._id} className="restaurant-card">
                    <div className="restaurant-img">
                      <img src={`http://localhost:5000/uploads/${r.image}`}  alt={r.name} />
                    </div>
                    <div className="restaurant-info">
                      <h3>{r.name}</h3>
                      <p>{r.location}</p>
                      <Link to={`/restaurants/${r._id}`} className="view-menu">
                        View Menu →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
    </div>
  );
};

export default Restaurants;
