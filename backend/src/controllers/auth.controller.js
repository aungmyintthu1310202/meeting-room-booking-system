import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Registers a new user
 * @route POST /api/auth/register
 */
export const Register = async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        error: "Name and password are required",
      });
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashed, role });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      data: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

/**
 * Logs in a user by id or by name/password
 * @route POST /api/auth/login
 */
export const Login = async (req, res) => {
  try {
    const { userId, name, password } = req.body;
    let user;

    if (userId) {
      user = await User.findById(userId);
    } else if (name && password) {
      user = await User.findOne({ name });
      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      }
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({
      token,
      user: { id: user._id.toString(), name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};
