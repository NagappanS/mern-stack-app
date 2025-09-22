// src/pages/Restaurants.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/API";
import "./Restaurants.css";

const Restaurants = () => {
  const [rests, setRests] = useState([]);

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

  return (
    <div className="restaunrants-container">
      <h2>Restaurants</h2>
      <div className="restaurants-grid">
        {rests.map(r => (
          <div key={r._id} className="restaurant-card">
            <img src={(`../assets/${r.image}`)} alt={r.name}/>
            <h3>{r.name}</h3>
            <p>{r.location}</p>
            <Link to={`/restaurants/${r._id}`}>View Menu</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Restaurants;
