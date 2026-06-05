import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { Person, Security, Work, Lock } from "@mui/icons-material";
import getClientName from "../../common/utils/getClientName";

function Login() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    <Container maxWidth="sm" sx={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          marginTop: 10,
          width: 420,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Lock sx={{ fontSize: 50, color: "#1976d2" }} />
          <Typography variant="h6" gutterBottom>
            Select User to Login
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth>
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
              <Typography color="error" sx={{ fontSize: 13, textAlign: "center" }}>
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                background: "linear-gradient(90deg, #1976d2, #42a5f5)",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
            <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
              If no users exist, ask an admin to create users.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
