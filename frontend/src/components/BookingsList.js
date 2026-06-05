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
  TableContainer,
  Chip,
  alpha,
  Tooltip,
  Skeleton,
  Fade,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  MeetingRoom as RoomIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingsList({ refreshToken }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  async function fetchBookings() {
    setLoading(true);
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
      setError("");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
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

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const isPastBooking = (endTime) => new Date(endTime) < new Date();

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(0,0,0,0.05)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 1, borderRadius: 2 }} />
        ))}
      </Paper>
    );
  }

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          background: "#fff",
          border: "1px solid rgba(0,0,0,0.05)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <RoomIcon sx={{ color: "#667eea" }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a2e" }}>
              Booking List
            </Typography>
            <Chip
              label={`${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                bgcolor: alpha("#667eea", 0.1),
                color: "#667eea",
                fontWeight: 500,
              }}
            />
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchBookings} size="small" sx={{ color: "#667eea" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2, borderRadius: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {bookings.length === 0 && !error ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <RoomIcon sx={{ fontSize: 48, color: "#ccc" }} />
            <Typography variant="body1" sx={{ color: "#999" }}>
              No bookings found
            </Typography>
            <Typography variant="body2" sx={{ color: "#bbb" }}>
              Create a new booking using the form above
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 450 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fc" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#666", width: 60 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666" }}>Start Date / Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666" }}>End Date / Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666" }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666" }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666" }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#666", width: 80, textAlign: "center" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {bookings.map((b, index) => {
                    const start = formatDateTime(b.startTime);
                    const end = formatDateTime(b.endTime);
                    const duration = getDuration(b.startTime, b.endTime);
                    const past = isPastBooking(b.endTime);
                    return (
                      <motion.tr
                        key={b.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        style={{
                          display: "table-row",
                          backgroundColor: past ? alpha("#f0f0f0", 0.4) : "transparent",
                        }}
                      >
                        <TableCell sx={{ color: "#888", fontWeight: 500 }}>
                          {String(index + 1).padStart(2, "0")}
                        </TableCell>
                        {/* Start Date / Time */}
                        <TableCell>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarIcon sx={{ fontSize: 14, color: "#667eea" }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {start.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 12, color: "#999" }} />
                              <Typography variant="caption" sx={{ color: "#666" }}>
                                {start.time}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        {/* End Date / Time */}
                        <TableCell>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <CalendarIcon sx={{ fontSize: 14, color: "#764ba2" }} />
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {end.date}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <TimeIcon sx={{ fontSize: 12, color: "#999" }} />
                              <Typography variant="caption" sx={{ color: "#666" }}>
                                {end.time}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={duration}
                            size="small"
                            sx={{
                              bgcolor: alpha("#10b981", 0.1),
                              color: "#10b981",
                              fontWeight: 500,
                              fontSize: "0.7rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: "#999" }} />
                            <Typography variant="body2">{b.userName || b.userId}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: "#666" }}>
                            {new Date(b.createdAt).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {canDelete(b) ? (
                            <Tooltip title="Delete booking">
                              <IconButton
                                onClick={() => handleDelete(b.id)}
                                size="small"
                                sx={{
                                  color: "#ef4444",
                                  "&:hover": { bgcolor: alpha("#ef4444", 0.1) },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="You don't have permission to delete this booking">
                              <IconButton disabled size="small">
                                <DeleteIcon fontSize="small" sx={{ color: "#ccc" }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {bookings.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #f0f0f0",
              bgcolor: "#fafbfc",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Typography variant="caption" sx={{ color: "#999" }}>
              Total: <strong>{bookings.length}</strong> booking(s)
            </Typography>
          </Box>
        )}
      </Paper>
    </Fade>
  );
}