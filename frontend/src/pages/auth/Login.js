import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Email,
  Lock,
  Facebook,
  LinkedIn,
  Google,
  ArrowForward,
  Person,
  Security,
  Work,
} from "@mui/icons-material";
import getClientName from "../../common/utils/getClientName";

function Login() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("hakeem@digital.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const clientName = getClientName();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/users");
        if (!res.ok) return;
        const data = await res.json();
        setUsers(data.users || []);
      } catch (e) {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleLogin() {
    if (!selected) {
      setError("Please select a user to login");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
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
      window.location.href = `/${clientName}/dashboard`;
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {/* Hero Section with Gradient */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 5,
              px: 4,
              textAlign: "center",
            }}
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
                mt: 1,
                maxWidth: 400,
                mx: "auto",
              }}
            >
              Meeting Room Booking System
            </Typography>
          </Box>

          {/* Login Form Section */}
          <Box sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "#1a1a2e",
                mb: 0.5,
              }}
            >
              Welcome back!
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

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#667eea" }} />
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {/* User */}
                <FormControl>
                  <InputLabel id="user-select-label">User</InputLabel>
                  <Select
                    labelId="user-select-label"
                    value={selected}
                    label="User"
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.role === "admin" ? (
                          <Security sx={{ mr: 1 }} />
                        ) : u.role === "owner" ? (
                          <Work sx={{ mr: 1 }} />
                        ) : (
                          <Person sx={{ mr: 1 }} />
                        )}
                        {u.name} ({u.role})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
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
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 25px rgba(102, 126, 234, 0.4)",
                    },
                  }}
                  endIcon={<ArrowForward />}
                >
                  Login
                </Button>

                <Box sx={{ textAlign: "center", mt: 1 }}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Don't have a user exist, ask an admin to create users?
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
