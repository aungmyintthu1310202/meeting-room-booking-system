import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate() {
    setError("");
    if (!name) {
      setError("Name required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, role }),
      });
      if (!res.ok) {
        const e = await res.json();
        setError(e.message || "Create failed");
        return;
      }
      setName("");
      setRole("user");
      fetchUsers();
    } catch {
      setError("Server error");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete user and their bookings?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const e = await res.json();
        setError(e.message || "Delete failed");
        return;
      }
      fetchUsers();
    } catch {
      setError("Server error");
    }
  }

  async function changeRole(id, newRole) {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const e = await res.json();
        setError(e.message || "Update failed");
        return;
      }
      fetchUsers();
    } catch {
      setError("Server error");
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User Management
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {error && <Alert severity="error">{error}</Alert>}

        {/* Create User Form */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            alignItems: "center",
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Create
          </Button>
        </Box>

        {/* User Table */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
                <TableCell>No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u, index) => (
                <TableRow key={u.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                      >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="owner">Owner</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(u.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "right", color: "gray" }}
        >
          Total: {users.length} user(s)
        </Typography>
      </Paper>
    </Container>
  );
}
