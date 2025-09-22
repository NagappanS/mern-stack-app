// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  totalPrice: { type: Number, required: true },
  deliveryInfo: {
    name: String,
    phone: String,
    address: String,
  },
  paymentInfo: {
    id: String,
    status: String,
  },
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ["pending", "preparing", "delivered"],
    default: "pending"
  }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
