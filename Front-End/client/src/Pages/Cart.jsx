// src/pages/Cart.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css"; // new CSS file for styling

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cart.items.length)
    return <div className="cart-empty"><h2>Your cart is empty</h2></div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.foodId} className="cart-item">
            <img src={(`http://localhost:5000/uploads/${item.image}`)} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
              <div className="quantity-selector">
                <button onClick={() => updateQuantity(item.foodId, Math.max(1, item.quantity - 1))}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.foodId, item.quantity + 1)}>+</button>
              </div>
            </div>
            <button className="remove-item" onClick={() => removeFromCart(item.foodId)}>Remove</button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <h3>Total: ₹{getTotal()}</h3>
        <div className="cart-buttons">
          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
          <button className="clear-btn" onClick={() => { if (window.confirm("Clear cart?")) clearCart(); }}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
