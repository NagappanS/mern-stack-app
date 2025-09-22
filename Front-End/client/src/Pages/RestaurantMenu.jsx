// src/pages/RestaurantMenu.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/API";
import { CartContext } from "../context/CartContext";
import "./RestaurantMenu.css";

const RestaurantMenu = () => {
  const { id } = useParams(); // restaurantId
  const [foods, setFoods] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [fRes, rAll] = await Promise.all([
          API.get(`/foods/${id}`),      // your backend route: GET /api/foods/:restaurantId
          API.get(`/restaurants`)      // fetch to find restaurant info (or create /restaurants/:id endpoint)
        ]);
        setFoods(fRes.data);
        const r = rAll.data.find(r => r._id === id);
        setRestaurant(r);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [id]);

  const handleAdd = (food) => {
    const result = addToCart(food, 1);
    if (!result.success) {
      if (window.confirm("Your cart contains items from another restaurant. Clear cart and add this item?")) {
        // force clear and then add
        localStorage.removeItem("cart");
        // rebuild in memory:
        addToCart(food, 1);
        window.location.reload(); // simple approach; or better: call cart context clear and add sequentially
      }
    } else {
      // optionally show a small toast
    }
  };

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div className="menu-container">
      <h2>{restaurant.name} — Menu</h2>
      <div className="foods-grid">
        {foods.map(f => (
          <div key={f._id} className="food-card">
            <img src={(`../assets/${f.image}`)}  alt={f.name}/>
            <h3>{f.name}</h3>
            <p>{f.description}</p>
            <p className="price">₹{f.price}</p>
            <div className="actions">
            <button onClick={() => handleAdd({ ...f, restaurant: id })}>Add to cart</button>
            <button onClick={() => navigate("/cart")} style={{ marginLeft: 8 }}>Go to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
