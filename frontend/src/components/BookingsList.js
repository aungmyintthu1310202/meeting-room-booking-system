import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Divider,
  TableContainer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function BookingsList({ refreshToken }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  async function fetchBookings() {
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Failed to load bookings");
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setError("Server error");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [refreshToken]);

  async function handleDelete(id) {
    if (!window.confirm("Delete booking?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to delete");
        return;
      }
      fetchBookings();
    } catch {
      setError("Server error");
    }
  }

  function canDelete(booking) {
    if (!booking) return false;
    return role === "admin" || role === "owner" || booking.userId === userId;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, width: "100%" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Booking List
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {error && <Alert severity="error">{error}</Alert>}

      {/* Scrollable Table */}
      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
              <TableCell>No.</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b, index) => (
              <TableRow key={b.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{new Date(b.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(b.endTime).toLocaleString()}</TableCell>
                <TableCell>{b.userName || b.userId}</TableCell>
                <TableCell>{new Date(b.createdAt).toLocaleString()}</TableCell>
                <TableCell align="center">
                  {canDelete(b) && (
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(b.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "right", color: "gray" }}
      >
        Total: {bookings.length} booking(s)
      </Typography>
    </Paper>
  );
}
