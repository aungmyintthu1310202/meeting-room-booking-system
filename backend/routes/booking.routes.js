import express from "express";
import { listBookings, createBooking, deleteBooking, getSummary } from "../src/controllers/booking.controller.js";

const router = express.Router();

router.get("/", listBookings);
router.get("/summary", getSummary);
router.post("/", createBooking);
router.delete("/:id", deleteBooking);

export default router;
