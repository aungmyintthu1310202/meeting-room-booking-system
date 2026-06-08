import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Logs in a user by id only
 * @route POST /api/auth/login
 */
export const Login = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Token expires in 8 hours
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
