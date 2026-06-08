import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Typography, alpha } from "@mui/material";
import { motion } from "framer-motion";
import {
  ErrorOutline as ErrorOutlineIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import getClientName from "../common/utils/getClientName";

export default function NotFound() {
  const navigate = useNavigate();
  const clientName = getClientName();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #f5f0ff 0%, #e0c3fc 50%, #c8b6ff 100%)",
        position: "relative",
        overflow: "hidden",
        py: 4,
      }}
    >
      {/* Animated floating blobs */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.6 + 0.2,
            }}
            animate={{
              y: [null, -40, 40, -20, 20, 0],
              x: [null, 30, -30, 15, -15, 0],
            }}
            transition={{
              duration: Math.random() * 18 + 12,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              width: Math.random() * 180 + 60,
              height: Math.random() * 180 + 60,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha("#a855f7", 0.12)} 0%, ${alpha("#7c3aed", 0.06)} 100%)`,
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />
        ))}
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
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
              boxShadow: "0 25px 45px -12px rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.4)",
              textAlign: "center",
              p: { xs: 4, sm: 6 },
            }}
          >
            {/* Animated 404 icon */}
            <motion.div
              initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 15px 30px rgba(102, 126, 234, 0.3)",
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 60, color: "#fff" }} />
              </Box>
            </motion.div>

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "5rem", sm: "7rem" },
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                  letterSpacing: "-2px",
                }}
              >
                404
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#1a1a2e",
                  mb: 1.5,
                }}
              >
                Page Not Found
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  maxWidth: 450,
                  mx: "auto",
                  mb: 4,
                }}
              >
                Oops! The page you're looking for doesn't exist or has been moved.
                Let's get you back to safety.
              </Typography>

              {/* Home Button */}
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(`/${clientName}/login`)}
                startIcon={<HomeIcon />}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 4,
                  px: 4,
                  py: 1.2,
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
              >
                Go to Home
              </Button>
            </motion.div>

            {/* Decorative small text */}
            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 5,
                color: "#aaa",
                letterSpacing: "0.5px",
              }}
            >
              Error 404 • Resource not found
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}