import express from "express";
import Restaurant from "../models/Restaurant.js";
import Food from "../models/Food.js"; 

const router = express.Router();

// Create a new restaurant
router.post("/restaurants", async (req, res) => {
    try {
        const newRestaurant = new Restaurant(req.body);
        const savedRestaurant = await newRestaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all restaurants
router.get("/restaurants", async (req , res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add food to a restaurant
router.post("/foods", async (req, res) => {
  try {
    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get foods by restaurant
router.get("/foods/:restaurantId", async (req, res) => {
  try {
    const foods = await Food.find({ restaurant: req.params.restaurantId });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;         