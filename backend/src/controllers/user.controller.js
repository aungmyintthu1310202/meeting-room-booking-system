import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";

// Show all users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();
    res.json({ users: users.map((u) => ({ id: u._id.toString(), name: u.name, role: u.role })) });
  } catch (err) {
    console.error("listUsers error:", err);
    res.status(500).json({ error: "Failed to load users" });
  }
};

// Create a new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { name, role = "user" } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User({ name, role});
    await user.save();

    res.status(201).json({
      user: { id: user._id.toString(), name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Delete a user and their bookings (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const deleteResult = await Booking.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted",
      deletedBookings: deleteResult.deletedCount,
      user: { id: user._id.toString(), name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// Update a user's role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!role || !["admin", "owner", "user"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ user: { id: user._id.toString(), name: user.name, role: user.role } });
  } catch (err) {
    console.error("updateUserRole error:", err);
    res.status(500).json({ error: "Failed to update role" });
  }
};
