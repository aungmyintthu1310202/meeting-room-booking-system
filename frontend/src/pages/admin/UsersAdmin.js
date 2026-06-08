import React, { useEffect, useState, useCallback } from "react";
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
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Chip,
  Avatar,
  Fade,
  alpha,
  Card,
  CardContent,
  Stack,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Security as OwnerIcon,
  Person as UserIcon,
  Refresh as RefreshIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersAdmin({ refreshToken }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const token = localStorage.getItem("token");

  // Base API URL
  const API_BASE = "http://localhost:5000/api";

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/users`, {
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
  }, [API_BASE, token]);

  useEffect(() => {
    fetchUsers();
  }, [refreshToken, fetchUsers]);

  // Reset to first page when users list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [users.length]);

  async function handleCreate() {
    setError("");
    setSuccess("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), role }),
      });
      if (!res.ok) {
        const e = await res.json();
        setError(e.message || "Create failed");
        return;
      }
      setSuccess(`User "${name}" created successfully!`);
      setName("");
      setRole("user");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Server error");
    }
  }

  async function handleDelete(id, userName) {
    if (!window.confirm(`Delete user "${userName}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const e = await res.json();
        setError(e.message || "Delete failed");
        return;
      }
      setSuccess(`User "${userName}" deleted successfully!`);
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Server error");
    }
  }

  async function changeRole(id, newRole, userName) {
    const confirmed = window.confirm(
      `Are you sure you want to change ${userName}'s role to ${newRole}? This will log you out on success.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
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
      localStorage.clear();
      window.location.href = "/";
    } catch {
      setError("Server error");
    }
  }

  const getRoleConfig = (roleValue) => {
    switch (roleValue) {
      case "admin":
        return { label: "Admin", color: "#667eea", icon: <AdminIcon sx={{ fontSize: 16 }} /> };
      case "owner":
        return { label: "Owner", color: "#f59e0b", icon: <OwnerIcon sx={{ fontSize: 16 }} /> };
      default:
        return { label: "User", color: "#10b981", icon: <UserIcon sx={{ fontSize: 16 }} /> };
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 4,
                p: 3,
                mb: 3,
                color: "#fff",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage system users, roles, and permissions
              </Typography>
            </Box>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {success}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card
              elevation={0}
              sx={{
                mb: 3,
                borderRadius: 3,
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 2.5,
                  }}
                >
                  <PersonAddIcon sx={{ color: "#667eea" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a2e" }}>
                    Add New User
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter user name"
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "#667eea",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#667eea",
                        },
                      },
                    }}
                  />
                  <FormControl sx={{ minWidth: 160 }}>
                    <InputLabel id="role-select-label">Role</InputLabel>
                    <Select
                      labelId="role-select-label"
                      value={role}
                      label="Role"
                      onChange={(e) => setRole(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#667eea",
                        },
                      }}
                    >
                      <MenuItem value="user">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <UserIcon sx={{ fontSize: 18, color: "#10b981" }} />
                          User
                        </Box>
                      </MenuItem>
                      <MenuItem value="owner">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <OwnerIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                          Owner
                        </Box>
                      </MenuItem>
                      <MenuItem value="admin">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AdminIcon sx={{ fontSize: 18, color: "#667eea" }} />
                          Admin
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleCreate}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 2,
                      px: 4,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    Create User
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Users Table Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.05)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a2e" }}>
                    System Users
                  </Typography>
                  <Chip
                    label={`${users.length} total`}
                    size="small"
                    sx={{
                      bgcolor: alpha("#667eea", 0.1),
                      color: "#667eea",
                      fontWeight: 500,
                    }}
                  />
                </Box>
                <Tooltip title="Refresh">
                  <IconButton onClick={fetchUsers} size="small" sx={{ color: "#667eea" }}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
                  <CircularProgress sx={{ color: "#667eea" }} />
                </Box>
              ) : users.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="body2" sx={{ color: "#999" }}>
                    No users found. Create your first user above.
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ overflowX: "auto" }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8f9fc" }}>
                          <TableCell sx={{ fontWeight: 600, color: "#666", width: 70 }}>#</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#666" }}>User</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#666", width: 180 }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#666", width: 100, textAlign: "center" }}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <AnimatePresence>
                          {currentUsers.map((u, idx) => {
                            const roleConfig = getRoleConfig(u.role);
                            const globalIndex = indexOfFirstUser + idx + 1;
                            return (
                              <motion.tr
                                key={u.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                                style={{ display: "table-row" }}
                              >
                                <TableCell sx={{ color: "#888", fontWeight: 500 }}>
                                  {String(globalIndex).padStart(2, "0")}
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar
                                      sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: alpha(roleConfig.color, 0.15),
                                        color: roleConfig.color,
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                      }}
                                    >
                                      {getInitials(u.name)}
                                    </Avatar>
                                    <Typography sx={{ fontWeight: 500, color: "#1a1a2e" }}>
                                      {u.name}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <FormControl size="small" sx={{ minWidth: 130 }}>
                                    <Select
                                      value={u.role}
                                      onChange={(e) => changeRole(u.id, e.target.value, u.name)}
                                      sx={{
                                        borderRadius: 2,
                                        "& .MuiSelect-select": {
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                          py: 0.8,
                                        },
                                      }}
                                      renderValue={(selected) => {
                                        const config = getRoleConfig(selected);
                                        return (
                                          <Chip
                                            label={config.label}
                                            size="small"
                                            icon={config.icon}
                                            sx={{
                                              bgcolor: alpha(config.color, 0.12),
                                              color: config.color,
                                              fontWeight: 500,
                                              "& .MuiChip-icon": { color: config.color },
                                            }}
                                          />
                                        );
                                      }}
                                    >
                                      <MenuItem value="user">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                          <UserIcon sx={{ fontSize: 18, color: "#10b981" }} />
                                          <span>User</span>
                                        </Box>
                                      </MenuItem>
                                      <MenuItem value="owner">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                          <OwnerIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                                          <span>Owner</span>
                                        </Box>
                                      </MenuItem>
                                      <MenuItem value="admin">
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                          <AdminIcon sx={{ fontSize: 18, color: "#667eea" }} />
                                          <span>Admin</span>
                                        </Box>
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Delete user">
                                    <IconButton
                                      onClick={() => handleDelete(u.id, u.name)}
                                      size="small"
                                      sx={{
                                        color: "#ef4444",
                                        "&:hover": { bgcolor: alpha("#ef4444", 0.1) },
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </motion.tr>
                            );
                          })}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </Box>

                  {/* Pagination Footer with Next/Previous buttons */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: "1px solid #f0f0f0",
                      bgcolor: "#fafbfc",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      Showing {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, users.length)} of{" "}
                      <strong>{users.length}</strong> user(s)
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
                          borderColor: alpha("#667eea", 0.5),
                          color: "#667eea",
                          "&:hover": {
                            borderColor: "#667eea",
                            backgroundColor: alpha("#667eea", 0.04),
                          },
                          "&.Mui-disabled": {
                            borderColor: alpha("#ccc", 0.5),
                            color: "#ccc",
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
                          bgcolor: alpha("#667eea", 0.1),
                          borderRadius: 2,
                          color: "#667eea",
                          fontWeight: 500,
                          display: "inline-flex",
                          alignItems: "center",
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
                          borderColor: alpha("#667eea", 0.5),
                          color: "#667eea",
                          "&:hover": {
                            borderColor: "#667eea",
                            backgroundColor: alpha("#667eea", 0.04),
                          },
                          "&.Mui-disabled": {
                            borderColor: alpha("#ccc", 0.5),
                            color: "#ccc",
                          },
                        }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                </>
              )}
            </Card>
          </motion.div>
        </Box>
      </Fade>
    </Container>
  );
}