import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
 try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing required fields" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // optional: check phone uniqueness server-side (good practice)
    if (phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) return res.status(400).json({ message: "Phone already in use" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, phone /* role/status defaulted by schema */ });
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account blocked. Contact admin." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
