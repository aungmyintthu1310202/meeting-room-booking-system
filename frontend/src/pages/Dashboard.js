import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Container,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MeetingRoom,
  People,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import getClientName from "../common/utils/getClientName";
import BookingForm from "../components/BookingForm";
import BookingsList from "../components/BookingsList";
import UsersAdmin from "./admin/UsersAdmin";

const drawerWidth = 260;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const location = useLocation();
  const clientName = getClientName();

  const [selectedView, setSelectedView] = useState(() =>
    location.pathname.includes("/admin") ? "users" : "bookings"
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const refresh = () => setTick((t) => t + 1);

  const drawer = (
    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "#f5f7fa", height: "100%" }}>
      {/* Profile Box */}
      <Box
        sx={{
          backgroundColor: "#f5f7fa",
          borderRadius: 2,
          p: 2,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          boxShadow: "inset 0 0 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Avatar Circle */}
        <Box
          sx={{
            width: 45,
            height: 45,
            borderRadius: "50%",
            backgroundColor: "#c4c4c4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#fff",
            fontSize: 18,
            mr: 2,
          }}
        >
          {(name && name[0].toUpperCase()) || "P"}
        </Box>

        {/* User Info */}
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 400, color: "#1976d2", lineHeight: 1 }}
          >
            {name || "User"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", fontSize: 16 }}>
            {role || "Admin"}
          </Typography>
        </Box>
      </Box>

      {/* Sidebar Menu */}
      <List>
        <ListItem
          button
          onClick={() => {
            setSelectedView("bookings");
            navigate(`/${clientName}/dashboard`);
          }}
        >
          <ListItemIcon>
            <MeetingRoom />
          </ListItemIcon>
          <ListItemText primary="Bookings" />
        </ListItem>
        {role === "admin" && (
          <ListItem
            button
            onClick={() => {
              setSelectedView("users");
              navigate(`/${clientName}/admin/users`);
            }}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItem>
        )}
      </List>

      {/* Logout Button */}
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          sx={{
            width: "80%",
            borderRadius: 2,
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "#f5f7fa",
          color: "#080000",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Meeting Room Booking System
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Container>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { md: "1fr" },
              gap: 3,
            }}
          >
            {selectedView === "bookings" ? (
              <>
                <BookingForm onCreated={refresh} />
                <BookingsList refreshToken={tick} />
              </>
            ) : (
              <UsersAdmin refreshToken={tick} />
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
