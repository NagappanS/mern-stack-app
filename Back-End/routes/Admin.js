// routes/admin.js
import express from "express";
import User from "../models/User.js";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();

// Middleware to verify JWT and extract user info
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing token" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // includes id and role
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};

router.patch("/users/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // validate status value
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    return res.json({ message: "Status updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/users/:id/role", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    return res.json({ message: "Role updated", user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
