// routes/admin.js
import express from "express";
import User from "../models/Users.js";
import Order from "../models/Order.js";
import Restaurant from "../models/Restaurant.js";
import Food from "../models/Food.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const router = express.Router();

// Middleware to verify JWT
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware for admin-only access
export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

// ✅ Update user status (activate/deactivate)
router.patch("/users/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; 
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Status updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user role
router.patch("/users/:id/role", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Role updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add new admin
router.post("/add-admin", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({ name, email, password: hashedPassword, phone, role: "admin" });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully", newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all admins
router.get("/admins", requireAuth, requireAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete admin
router.delete("/delete-admin/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// add inside routes/admin.js (requires requireAuth & requireAdmin middleware to be defined)
router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalFoods = await Food.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
    ]);

    const ordersPerDay = await Order.aggregate([
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const revenueByMonth = await Order.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const topSellingFoods = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.foodName", count: { $sum: "$items.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      cards: {
        pendingOrders,
        completedOrders,
        totalUsers,
        totalRestaurants,
        totalFoods,
        totalRevenue: totalRevenue[0]?.sum || 0
      },
      charts: {
        ordersPerDay: ordersPerDay.map(d => ({ date: d._id, count: d.count })),
        revenueByMonth: revenueByMonth.map(m => ({
          month: new Date(2025, m._id - 1).toLocaleString("default", { month: "short" }),
          revenue: m.revenue
        })),
        topSellingFoods: topSellingFoods.map(f => ({ name: f._id, count: f.count }))
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", error: err.message });
  }
});

// Add a new user (admin creates manually)
router.post("/users", async (req, res) => {
  try {
    const { name, email, password, phone, role, status } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) return res.status(400).json({ message: "Phone already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, phone, role: role || "user", status: status || "active" });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit user
router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, phone, role, status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, status },
      { new: true }
    );
    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Block / Unblock user
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // status = "active" or "blocked"
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `User ${status}`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users with optional filters
router.get("/users", async (req, res) => {
  try {
    const { status, role } = req.query; // e.g., /users?status=active&role=user
    let query = {};
    if (status) query.status = status;
    if (role) query.role = role;

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
