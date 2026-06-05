import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

const checkOverlap = async (start, end) => {
  return Booking.findOne({
    $and: [
      { startTime: { $lt: end } },
      { endTime: { $gt: start } },
    ],
  });
};

export const listBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .sort({ startTime: 1 })
      .lean();

    res.json({ bookings: bookings.map((b) => ({
      id: b._id.toString(),
      userId: b.userId?._id?.toString() || b.userId?.toString(),
      userName: b.userId?.name || "Unknown",
      startTime: b.startTime,
      endTime: b.endTime,
      createdAt: b.createdAt,
    })) });
  } catch (err) {
    console.error("listBookings error:", err);
    res.status(500).json({ error: "Failed to load bookings" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    const userId = req.user.id;

    if (!startTime || !endTime) {
      return res.status(400).json({ error: "startTime and endTime are required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (start >= end) {
      return res.status(400).json({ error: "startTime must be before endTime" });
    }

    const existing = await checkOverlap(start, end);
    if (existing) {
      return res.status(400).json({ error: "Booking time overlaps an existing booking" });
    }

    const booking = new Booking({ userId, startTime: start, endTime: end });
    await booking.save();

    res.status(201).json({
      booking: {
        id: booking._id.toString(),
        userId: booking.userId.toString(),
        startTime: booking.startTime,
        endTime: booking.endTime,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (role === "admin" || role === "owner" || booking.userId.toString() === userId) {
      await booking.deleteOne();
      return res.json({ message: "Booking deleted" });
    }

    return res.status(403).json({ error: "Not authorized to delete this booking" });
  } catch (err) {
    console.error("deleteBooking error:", err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};

export const getSummary = async (req, res) => {
  try {
    const role = req.user.role;
    if (!["admin", "owner"].includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const totals = await Booking.aggregate([
      { $group: { _id: "$userId", totalBookings: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 0, userId: { $toString: "$_id" }, name: "$user.name", role: "$user.role", totalBookings: 1 } },
      { $sort: { totalBookings: -1 } },
    ]);

    const bookingsByUser = await Booking.aggregate([
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { startTime: 1, endTime: 1, createdAt: 1, userId: { $toString: "$userId" }, userName: "$user.name" } },
      { $sort: { userName: 1, startTime: 1 } },
    ]);

    res.json({ totals, bookingsByUser });
  } catch (err) {
    console.error("getSummary error:", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
};
