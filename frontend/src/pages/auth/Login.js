import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  alpha,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { motion } from "framer-motion";
import getClientName from "../../common/utils/getClientName";

function Login() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const clientName = getClientName();

  // Base API URL
  const API_BASE = "http://localhost:5000/api";

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/users`);
        if (!res.ok) {
          setError("Failed to load users");
          return;
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch (e) {
        setError("Internal server error");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Handle Login
  async function handleLogin() {
    if (!selected) {
      setError("Please select a user to login");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Login failed");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token || "token-placeholder");
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      window.location.href = `/${clientName}/createBooking`;
    } catch (e) {
      setError("Server error");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f0ff 0%, #e0c3fc 40%, #c8b6ff 70%, #b8b5ff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background bubbles - updated colors */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: [null, -50, 50, -30, 30, 0],
              x: [null, 40, -40, 20, -20, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              width: Math.random() * 120 + 40,
              height: Math.random() * 120 + 40,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha("#ffffff", 0.15)} 0%, ${alpha("#ffffff", 0.08)} 100%)`,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 6,
              overflow: "hidden",
              background: alpha("#ffffff", 0.92),
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            {/* Hero Section with Gradient + Logo */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                py: 4,
                px: 4,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Box
                  component="img"
                  src="/images/logo.png"
                  alt="Chat App Logo"
                  sx={{
                    width: { xs: 120, sm: 120, md: 120 },
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    mx: "auto",
                    mb: 2,
                    mt: -3,
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  Meeting Room Booking System
                </Typography>
              </motion.div>
            </Box>

            {/* Form Section */}
            <Box sx={{ p: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#1a1a2e",
                    mb: 0.5,
                  }}
                >
                  Welcome back
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    mb: 3,
                  }}
                >
                  Please select a user to login
                </Typography>
              </motion.div>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress sx={{ color: "#667eea" }} />
                </Box>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                  {/* User Select */}
                  <FormControl fullWidth>
                    <InputLabel id="user-select-label">Select User</InputLabel>
                    <Select
                      labelId="user-select-label"
                      value={selected}
                      label="Select User"
                      onChange={(e) => setSelected(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: alpha("#667eea", 0.3),
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#667eea",
                        },
                      }}
                    >
                      {users.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor:
                                  u.role === "admin"
                                    ? "#667eea"
                                    : u.role === "owner"
                                      ? "#f59e0b"
                                      : "#10b981",
                                fontSize: "0.8rem",
                              }}
                            >
                              {u.name.charAt(0).toUpperCase()}
                            </Avatar>
                            {u.name}{" "}
                            <Typography
                              component="span"
                              sx={{ color: "#888", fontSize: "0.8rem" }}
                            >
                              ({u.role})
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Alert severity="error" sx={{ borderRadius: 2 }}>
                        {error}
                      </Alert>
                    </motion.div>
                  )}

                  {/* Login Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 14px 28px rgba(102, 126, 234, 0.4)",
                      },
                    }}
                    endIcon={<ArrowForward />}
                  >
                    Login
                  </Button>

                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Don't have a user? Ask an admin to create users.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}

export default Login;