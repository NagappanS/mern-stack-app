import express from "express";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware: check login
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Place new order
router.post("/orders", authMiddleware, async (req, res) => {
  try {
    const { items, deliveryInfo, paymentInfo, location } = req.body;
    // console.log("Order items:", req.body);
    if (!items?.length) return res.status(400).json({ error: "Items array is required" });

    let totalPrice = 0;
    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food) return res.status(400).json({ error: "Food not found" });
      totalPrice += food.price * item.quantity;
    }

    if (!paymentInfo || paymentInfo.status !== "succeeded") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const newOrder = new Order({
      user: req.userId,
      items,
      totalPrice,
      deliveryInfo,
      paymentInfo,
      location,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get logged-in user's orders
router.get("/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.food")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create PaymentIntent
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PaymentIntent creation failed" });
  }
});

// Test token
router.get("/test-token", authMiddleware, (req, res) => {
  res.json({ message: "Token is valid", userId: req.userId });
});

export default router;
