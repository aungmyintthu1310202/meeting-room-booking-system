import React, { useEffect, useState, useCallback } from "react";
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
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  LinearProgress,
  
} from "@mui/material";
import {
  Delete as DeleteIcon,
  MeetingRoom as RoomIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PeopleAlt as PeopleIcon,
  EventNote as EventNoteIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingsList({ refreshToken }) {
  const [bookings, setBookings] = useState([]);
  const [summary, setSummary] = useState({ totals: [], bookingsByUser: [] });
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // Base API URL
  const API_BASE = "http://localhost:5000/api";

  const fetchSummary = useCallback(async () => {
    if (!role || !["admin", "owner"].includes(role)) {
      setSummary({ totals: [], bookingsByUser: [] });
      return;
    }

    setSummaryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setSummary({
        totals: data.totals || [],
        bookingsByUser: data.bookingsByUser || [],
      });
    } catch {
      // keep summary state if fetch fails
    } finally {
      setSummaryLoading(false);
    }
  }, [API_BASE, token, role]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setError("Failed to load bookings");
        return;
      }
      const data = await res.json();
      setBookings(data.bookings || []);
      setError("");
      await fetchSummary();
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token, fetchSummary]);

  useEffect(() => {
    fetchBookings();
  }, [refreshToken, fetchBookings]);

  // Reset to first page when bookings list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [bookings.length]);

  async function handleDelete(id) {
    if (!window.confirm("Delete booking?")) return;
    try {
      const res = await fetch(
        `${API_BASE}/bookings/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getDuration = (start, end) => {
    const diff = new Date(end) - new Date(start);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const isPastBooking = (endTime) => new Date(endTime) < new Date();

  // Pagination logic
  const indexOfLastBooking = currentPage * rowsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - rowsPerPage;
  const currentBookings = bookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking,
  );
  const totalPages = Math.ceil(bookings.length / rowsPerPage);

  const groupedBookings = summary.bookingsByUser.reduce((acc, booking) => {
    const key = booking.userName || booking.userId || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(booking);
    return acc;
  }, {});

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 4, border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={50} width="100%" />
          <Skeleton variant="rounded" height={400} />
        </Stack>
      </Paper>
    );
  }

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "#fff",
          border: "1px solid #f0f2f5",
          boxShadow: "0 8px 24px rgba(0,0,0,0.02)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            py: 2.5,
            borderBottom: "1px solid #f0f2f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #fafcff 0%, #ffffff 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{ bgcolor: alpha("#667eea", 0.1), width: 40, height: 40 }}
            >
              <RoomIcon sx={{ color: "#667eea" }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
              Booking List
            </Typography>
            <Chip
              label={`${bookings.length} booking${bookings.length !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                bgcolor: alpha("#667eea", 0.1),
                color: "#667eea",
                fontWeight: 600,
                borderRadius: 2,
              }}
            />
          </Box>
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchBookings}
              sx={{
                color: "#667eea",
                "&:hover": { bgcolor: alpha("#667eea", 0.05) },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Dashboard Summary - Only two metric cards */}
        {["admin", "owner"].includes(role) && (
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              borderBottom: "1px solid #f0f2f5",
              bgcolor: "#fafcff",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "#1a1a2e",
                  letterSpacing: "-0.3px",
                }}
              >
                📊 Booking Insights
              </Typography>
              <Button
                size="small"
                variant="text"
                startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
                onClick={fetchBookings}
                sx={{
                  textTransform: "none",
                  color: "#667eea",
                  fontWeight: 500,
                  "&:hover": { bgcolor: alpha("#667eea", 0.05) },
                }}
              >
                Refresh
              </Button>
            </Stack>

            {summaryLoading ? (
              <LinearProgress
                sx={{
                  borderRadius: 2,
                  bgcolor: alpha("#667eea", 0.1),
                  "& .MuiLinearProgress-bar": { bgcolor: "#667eea" },
                }}
              />
            ) : (
              <Grid container spacing={3}>
                {/* Two metric cards: Total Active Users and Total Bookings */}
                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      background:
                        "linear-gradient(145deg, #f8f4ff 0%, #f0eaff 100%)",
                      border: "1px solid rgba(102,126,234,0.15)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(102,126,234,0.15)",
                      },
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#667eea",
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                            }}
                          >
                            TOTAL ACTIVE USERS
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ fontWeight: 800, color: "#1a1a2e", mt: 0.5 }}
                          >
                            {summary.totals.length}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: alpha("#667eea", 0.2),
                            width: 48,
                            height: 48,
                          }}
                        >
                          <PeopleIcon sx={{ color: "#667eea" }} />
                        </Avatar>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      background:
                        "linear-gradient(145deg, #eef9ff 0%, #e0f2fe 100%)",
                      border: "1px solid rgba(56,189,248,0.2)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(56,189,248,0.15)",
                      },
                    }}
                  >
                    <CardContent>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#0ea5e9",
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                            }}
                          >
                            TOTAL BOOKINGS
                          </Typography>
                          <Typography
                            variant="h3"
                            sx={{ fontWeight: 800, color: "#1a1a2e", mt: 0.5 }}
                          >
                            {bookings.length}
                          </Typography>
                        </Box>
                        <Avatar
                          sx={{
                            bgcolor: alpha("#0ea5e9", 0.2),
                            width: 48,
                            height: 48,
                          }}
                        >
                          <EventNoteIcon sx={{ color: "#0ea5e9" }} />
                        </Avatar>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Two-column layout – stack on mobile */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      border: "1px solid #f0f2f5",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ p: 2.5, borderBottom: "1px solid #f0f2f5" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#1a1a2e" }}
                      >
                        👥 Bookings by User
                      </Typography>
                    </Box>
                    {summary.totals.length === 0 ? (
                      <Typography
                        variant="body2"
                        sx={{ color: "#999", textAlign: "center", py: 4 }}
                      >
                        No user booking data available.
                      </Typography>
                    ) : (
                      <TableContainer sx={{ overflowX: "auto" }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "#fafafa" }}>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#555" }}
                              >
                                User
                              </TableCell>
                              <TableCell
                                sx={{ fontWeight: 600, color: "#555" }}
                              >
                                Role
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: 600, color: "#555" }}
                              >
                                Total
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {summary.totals.map((user) => (
                              <TableRow
                                key={user.userId}
                                hover
                                sx={{ "&:last-child td": { borderBottom: 0 } }}
                              >
                                <TableCell
                                  sx={{ fontWeight: 500, color: "#1a1a2e" }}
                                >
                                  {user.name || "Unknown"}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={user.role}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(
                                        user.role === "admin"
                                          ? "#667eea"
                                          : user.role === "owner"
                                            ? "#f59e0b"
                                            : "#10b981",
                                        0.1,
                                      ),
                                      color:
                                        user.role === "admin"
                                          ? "#667eea"
                                          : user.role === "owner"
                                            ? "#f59e0b"
                                            : "#10b981",
                                      fontWeight: 500,
                                      textTransform: "capitalize",
                                      borderRadius: 1.5,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Chip
                                    label={user.totalBookings}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha("#667eea", 0.1),
                                      color: "#667eea",
                                      fontWeight: 600,
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      border: "1px solid #f0f2f5",
                      height: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <Box sx={{ p: 2.5, borderBottom: "1px solid #f0f2f5" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 700, color: "#1a1a2e" }}
                      >
                        🗂️ Detailed Bookings by User
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2, maxHeight: 400, overflowY: "auto" }}>
                      {Object.keys(groupedBookings).length === 0 ? (
                        <Typography
                          variant="body2"
                          sx={{ color: "#999", textAlign: "center", py: 4 }}
                        >
                          No detailed booking data.
                        </Typography>
                      ) : (
                        <Stack spacing={2}>
                          {Object.entries(groupedBookings).map(
                            ([userName, bookingsForUser]) => (
                              <Card
                                key={userName}
                                elevation={0}
                                sx={{
                                  borderRadius: 3,
                                  border: "1px solid #f0f2f5",
                                  overflow: "hidden",
                                }}
                              >
                                <Box
                                  sx={{
                                    p: 2,
                                    bgcolor: "#fafcff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    cursor: "pointer",
                                    transition: "0.2s",
                                    "&:hover": { bgcolor: "#f5f7ff" },
                                  }}
                                  onClick={() => {
                                    const el = document.getElementById(
                                      `group-${userName.replace(/\s/g, "")}`,
                                    );
                                    if (el)
                                      el.style.display =
                                        el.style.display === "none"
                                          ? "block"
                                          : "none";
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 1.5,
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: alpha("#667eea", 0.1),
                                        color: "#667eea",
                                      }}
                                    >
                                      <PersonIcon fontSize="small" />
                                    </Avatar>
                                    <Typography
                                      sx={{ fontWeight: 600, color: "#1a1a2e" }}
                                    >
                                      {userName}
                                    </Typography>
                                    <Chip
                                      label={`${bookingsForUser.length} booking${bookingsForUser.length !== 1 ? "s" : ""}`}
                                      size="small"
                                      sx={{
                                        bgcolor: "#667eea",
                                        color: "#fff",
                                        fontWeight: 500,
                                        borderRadius: 1.5,
                                      }}
                                    />
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#667eea", fontWeight: 500 }}
                                  >
                                    Click to expand
                                  </Typography>
                                </Box>
                                <Box
                                  id={`group-${userName.replace(/\s/g, "")}`}
                                  sx={{
                                    display: "none",
                                    p: 2,
                                    bgcolor: "#fff",
                                    borderTop: "1px solid #f0f2f5",
                                  }}
                                >
                                  <Stack spacing={1}>
                                    {bookingsForUser.map((item, idx) => {
                                      const { date, time } = formatDateTime(
                                        item.startTime,
                                      );
                                      const duration = getDuration(
                                        item.startTime,
                                        item.endTime,
                                      );
                                      return (
                                        <Box
                                          key={`${item.userId}-${item.startTime}-${idx}`}
                                          sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            flexWrap: "wrap",
                                            gap: 1,
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: "#fafafa",
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <CalendarIcon
                                              sx={{
                                                fontSize: 14,
                                                color: "#667eea",
                                              }}
                                            />
                                            <Typography variant="body2">
                                              {date} at {time}
                                            </Typography>
                                          </Box>
                                          <Chip
                                            label={duration}
                                            size="small"
                                            sx={{
                                              bgcolor: alpha("#10b981", 0.1),
                                              color: "#10b981",
                                              fontSize: "0.7rem",
                                            }}
                                          />
                                        </Box>
                                      );
                                    })}
                                  </Stack>
                                </Box>
                              </Card>
                            ),
                          )}
                        </Stack>
                      )}
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{ m: 2, borderRadius: 2 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {bookings.length === 0 && !error ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <RoomIcon sx={{ fontSize: 64, color: "#d1d5db", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#6b7280", fontWeight: 500 }}>
              No bookings found
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Create a new booking using the form above
            </Typography>
          </Box>
        ) : (
          <>
            {/* Main booking table with horizontal scroll on small screens */}
            <TableContainer sx={{ maxHeight: 450, overflowX: "auto" }}>
              <Table stickyHeader sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fc" }}>
                    <TableCell
                      sx={{ fontWeight: 600, color: "#6b7280", width: 60 }}
                    >
                      #
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                      Start Date / Time
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                      End Date / Time
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                      Duration
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                      Created By
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#6b7280" }}>
                      Created At
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "#6b7280",
                        width: 80,
                        textAlign: "center",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <AnimatePresence>
                    {currentBookings.map((b, idx) => {
                      const start = formatDateTime(b.startTime);
                      const end = formatDateTime(b.endTime);
                      const duration = getDuration(b.startTime, b.endTime);
                      const past = isPastBooking(b.endTime);
                      const globalIndex = indexOfFirstBooking + idx + 1;
                      return (
                        <motion.tr
                          key={b.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2, delay: idx * 0.03 }}
                          style={{
                            backgroundColor: past
                              ? alpha("#f3f4f6", 0.4)
                              : "transparent",
                          }}
                        >
                          <TableCell sx={{ color: "#9ca3af", fontWeight: 500 }}>
                            {String(globalIndex).padStart(2, "0")}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CalendarIcon
                                  sx={{ fontSize: 14, color: "#667eea" }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {start.date}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <TimeIcon
                                  sx={{ fontSize: 12, color: "#9ca3af" }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7280" }}
                                >
                                  {start.time}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CalendarIcon
                                  sx={{ fontSize: 14, color: "#764ba2" }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {end.date}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <TimeIcon
                                  sx={{ fontSize: 12, color: "#9ca3af" }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#6b7280" }}
                                >
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
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <PersonIcon
                                sx={{ fontSize: 16, color: "#9ca3af" }}
                              />
                              <Typography variant="body2">
                                {b.userName || b.userId}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ color: "#6b7280", fontSize: "0.75rem" }}
                            >
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
                                    "&:hover": {
                                      bgcolor: alpha("#ef4444", 0.1),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="No permission">
                                <IconButton disabled size="small">
                                  <DeleteIcon
                                    fontSize="small"
                                    sx={{ color: "#d1d5db" }}
                                  />
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

            {/* Pagination Footer */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #f0f2f5",
                bgcolor: "#fafcff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#9ca3af" }}>
                Showing {indexOfFirstBooking + 1}–
                {Math.min(indexOfLastBooking, bookings.length)} of{" "}
                <strong>{bookings.length}</strong> booking(s)
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  startIcon={<ChevronLeftIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: alpha("#667eea", 0.3),
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#667eea",
                      bgcolor: alpha("#667eea", 0.04),
                    },
                  }}
                >
                  Previous
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: alpha("#667eea", 0.08),
                    borderRadius: 2,
                    color: "#667eea",
                    fontWeight: 500,
                  }}
                >
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  endIcon={<ChevronRightIcon />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    borderColor: alpha("#667eea", 0.3),
                    color: "#667eea",
                    "&:hover": {
                      borderColor: "#667eea",
                      bgcolor: alpha("#667eea", 0.04),
                    },
                  }}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Fade>
  );
}