import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import API from "../api/API";
import "./CheckOut.css";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Leaflet marker fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map click component
function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    }
  });
  return position ? <Marker position={position} /> : null;
}

// Stripe Checkout Form
const StripeForm = ({ cart, deliveryInfo, position, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1. Create payment intent on backend
      const { data } = await API.post("/create-payment-intent", {
        amount: cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100 // in paise
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: deliveryInfo.name,
            email: localStorage.getItem("email") || "test@example.com"
          }
        }
      });

      if (result.error) {
        alert(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === "succeeded") {
        // Payment succeeded, call parent to place order
        onPaymentSuccess({
        id: result.paymentIntent.id,
        status: result.paymentIntent.status
      });

      }

    } catch (err) {
      console.error(err);
      alert("Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="stripe-form">
      <h3>Payment</h3>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || loading} className="place-order-btn">
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const stripePromise = loadStripe("pk_test_51S9nNvHUqKSgeHBwoViUMu3HEI7o0tTp6kByH1kbjRa0IxkGoEJF5vl4KKHrZ7nxw3AHOKAZGQsJ2SXueyzusli600Ll6a1t5z"); // your Stripe test key

const CheckOut = () => {
  const { cart, clearCart, getTotal } = useContext(CartContext);
  const [deliveryInfo, setDeliveryInfo] = useState({ name: "", phone: "", address: "" });
  const [position, setPosition] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
  };

  // inside CheckOut.jsx

const placeOrder = async (paymentInfo) => {
  if (!cart.items.length) return alert("Cart empty.");
  if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address)
    return alert("Please fill all delivery details.");
  if (!position) return alert("Please select your delivery location on the map.");

  try {
    const items = cart.items.map(i => ({
      food: i.foodId,   // adjust to backend field (check DB: maybe it's "id" or "_id")
      quantity: i.quantity
    }));

    const payload = {
      items,
      deliveryInfo,
      location: { lat: position[0], lng: position[1] },
      paymentInfo   // now passing full { id, status }
    };

    const res = await API.post("/orders", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    console.log("Order response:", res.data);
    clearCart();
    alert("Order placed successfully!");
    navigate("/orders");
  } catch (err) {
    console.error("Order placement failed:", err.response?.data || err.message);
    alert("Failed to place order: " + (err.response?.data?.message || "Server error"));
  }
};


  if (!cart.items.length)
    return <div className="checkout-empty"><h2>Your cart is empty</h2></div>;

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <div className="checkout-items">
        {cart.items.map(item => (
          <div key={item.foodId} className="checkout-item">
            {/* <img src={(`../assets/${item.image}`)} alt={item.name} /> */}
            <div>
              <h4>{item.name}</h4>
              <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <h3>Total: ₹{getTotal()}</h3>

      <div className="delivery-form">
        <h3>Delivery Details</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={deliveryInfo.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={deliveryInfo.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={deliveryInfo.address}
          onChange={handleChange}
        />

        <h3>Select Delivery Location</h3>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: 300, width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker position={position} setPosition={setPosition} />
        </MapContainer>
        <p style={{ fontSize: 14, marginTop: 5 }}>
          {position ? `Selected: Lat ${position[0].toFixed(4)}, Lng ${position[1].toFixed(4)}` : "Click on map to select location"}
        </p>
      </div>

      {/* Stripe Payment */}
     <Elements stripe={stripePromise}>
      <StripeForm
        cart={cart}
        deliveryInfo={deliveryInfo}
        position={position}
        onPaymentSuccess={placeOrder}
      />
      </Elements>
    </div>
  );
};

export default CheckOut;
