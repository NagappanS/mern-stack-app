import { useEffect, useState } from "react";
import API from "../api/API";

const Foods = () => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await API.get("/foods");
        setFoods(res.data);
      } catch (err) {
        console.error("Error fetching foods", err);
      }
    };
    fetchFoods();
  }, []);

  const addToCart = (food) => {
    setCart([...cart, food]);
    alert(`${food.name} added to cart!`);
  };

  return (
    <div>
      <h2>Foods</h2>
      <ul>
        {foods.map((f) => (
          <li key={f._id}>
            <h3>{f.name}</h3>
            <p>₹{f.price}</p>
            <button onClick={() => addToCart(f)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      <ul>
        {cart.map((c, index) => (
          <li key={index}>
            {c.name} - ₹{c.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Foods;
