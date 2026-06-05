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
  Avatar,
  Badge,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MeetingRoom,
  People,
  Logout,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  NotificationsNone as NotificationsIcon,
  Brightness4 as DarkModeIcon,
} from "@mui/icons-material";
import getClientName from "../common/utils/getClientName";
import BookingForm from "../components/BookingForm";
import BookingsList from "../components/BookingsList";
import UsersAdmin from "./admin/UsersAdmin";

const drawerWidth = 280;

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const location = useLocation();
  const clientName = getClientName();
  const theme = useTheme();

  const [selectedView, setSelectedView] = useState(() =>
    location.pathname.includes("/admin") ? "users" : "bookings",
  );

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const refresh = () => setTick((t) => t + 1);

  const getInitials = () => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = () => {
    if (role === "admin") return "#667eea";
    if (role === "owner") return "#f59e0b";
    return "#10b981";
  };

  const menuItems = [
    { id: "bookings", label: "Bookings", icon: MeetingRoom, path: "dashboard" },
  ];

  if (role === "admin") {
    menuItems.push({
      id: "users",
      label: "User Management",
      icon: People,
      path: "admin/users",
    });
  }

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo / Brand Section */}
      <Box
        sx={{
          py: 3,
          px: 2,
          textAlign: "center",
          borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
        }}
      >
        <Box
          component="img"
          src="/images/logo.png"
          alt="Chat App Logo"
          sx={{
            width: { xs: 70, sm: 70, md: 70 },
            maxWidth: "100%",
            height: "auto",
            display: "block",
            mx: "auto",
          }}
        />
        <Typography
          variant="subtitle2"
          sx={{
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.75rem",
            mt: 0.5,
          }}
        >
          Meeting Room Booking System
        </Typography>
      </Box>

      {/* Profile Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${alpha("#fff", 0.1)}`,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            bgcolor: getRoleColor(),
            fontWeight: "bold",
            fontSize: "1.2rem",
            boxShadow: `0 4px 12px ${alpha(getRoleColor(), 0.4)}`,
          }}
        >
          {getInitials()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#fff", fontWeight: 600, lineHeight: 1.2 }}
          >
            {name || "User"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: alpha("#fff", 0.7),
              textTransform: "capitalize",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: getRoleColor(),
                display: "inline-block",
              }}
            />
            {role || "Admin"}
          </Typography>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.id}
            button
            onClick={() => {
              setSelectedView(item.id);
              navigate(`/${clientName}/${item.path}`);
            }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              backgroundColor:
                selectedView === item.id
                  ? alpha("#667eea", 0.2)
                  : "transparent",
              "&:hover": {
                backgroundColor: alpha("#667eea", 0.15),
              },
              "& .MuiListItemIcon-root": {
                color:
                  selectedView === item.id ? "#667eea" : alpha("#fff", 0.6),
              },
              "& .MuiListItemText-primary": {
                color: selectedView === item.id ? "#fff" : alpha("#fff", 0.7),
                fontWeight: selectedView === item.id ? 600 : 400,
              },
            }}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, pt: 1, pb: 3 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          sx={{
            borderColor: alpha("#ef4444", 0.5),
            color: "#ef4444",
            borderRadius: 2,
            py: 1,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              borderColor: "#ef4444",
              backgroundColor: alpha("#ef4444", 0.1),
            },
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

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${collapsed ? 80 : drawerWidth}px)` },
          ml: { sm: `${collapsed ? 80 : drawerWidth}px` },
          background: "#fff",
          color: "#1a1a2e",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: "none" }, mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => setCollapsed(!collapsed)}
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <ChevronLeftIcon
                sx={{
                  transform: collapsed ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            </IconButton>
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              {selectedView === "bookings"
                ? "Bookings Dashboard"
                : "User Management"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{
          width: { sm: collapsed ? 80 : drawerWidth },
          flexShrink: { sm: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Mobile Drawer */}
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
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: collapsed ? 80 : drawerWidth,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
              borderRight: "none",
            },
          }}
          open
        >
          {collapsed ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: getRoleColor(),
                  mb: 2,
                  mt: 2,
                }}
              >
                {getInitials()}
              </Avatar>
              {menuItems.map((item) => (
                <IconButton
                  key={item.id}
                  onClick={() => {
                    setSelectedView(item.id);
                    navigate(`/${clientName}/${item.path}`);
                  }}
                  sx={{
                    color:
                      selectedView === item.id ? "#667eea" : alpha("#fff", 0.6),
                    mb: 1,
                    "&:hover": {
                      backgroundColor: alpha("#667eea", 0.15),
                    },
                  }}
                >
                  <item.icon />
                </IconButton>
              ))}
              <Box sx={{ flex: 1 }} />
              <IconButton
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                }}
                sx={{ color: "#ef4444", mb: 2 }}
              >
                <Logout />
              </IconButton>
            </Box>
          ) : (
            drawerContent
          )}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${collapsed ? 80 : drawerWidth}px)` },
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
