// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import API from "../api/API";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : orders.map(o => (
        <div key={o._id} style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}>
          <p>Order ID: {o._id}</p>
          <p>Status: {o.status}</p>
          <p>Placed: {new Date(o.createdAt).toLocaleString()}</p>
          <div>
            {o.items.map(it => (
              <div key={it.food._id} style={{ display: "flex", gap: 12 }}>
                {/* <img alt={it.food.name} style={{ width: 80, height: 60, objectFit: "cover" }} /> */}
                <div>
                  <strong>{it.food.name}</strong>
                  <p>₹{it.food.price} × {it.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <p>Total: ₹{o.totalPrice}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
