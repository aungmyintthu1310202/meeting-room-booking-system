import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import getClientName from "../common/utils/getClientName";

export default function NotFound() {
  const navigate = useNavigate();
  const clientName = getClientName();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          borderRadius: 4,
          p: 5,
          textAlign: "center",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f0f4 100%)",
        }}
      >
        <Box
          sx={{
            mb: 3,
            width: 100,
            height: 100,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#1976d2",
            color: "common.white",
            boxShadow: 3,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/${clientName}/login`)}
          sx={{
            backgroundColor: "#1976d2",
            color: "common.white", 
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Go to Home
        </Button>
      </Paper>
    </Container>
  );
}
