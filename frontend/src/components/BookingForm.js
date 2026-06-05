import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Paper,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

export default function BookingForm({ onCreated }) {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  function combineDateTime(date, time) {
    if (!date || !time) return null;
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    return combined.toISOString();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const startISO = combineDateTime(startDate, startTime);
    const endISO = combineDateTime(endDate, endTime);

    if (!startISO || !endISO) {
      setError("Please select both date and time for start and end.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startTime: startISO, endTime: endISO }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to create booking");
        return;
      }

      setStartDate(null);
      setStartTime(null);
      setEndDate(null);
      setEndTime(null);
      onCreated && onCreated();
    } catch {
      setError("Server error");
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          width: "100%",
          boxSizing: "border-box",
          bgcolor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 500,
            fontSize: "1.3rem",
            color: "#000",
          }}
        >
          Create Booking
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Start Date & Time Section */}
          <Typography
            sx={{
              mb: 1.5,
              fontWeight: 500,
              fontSize: "0.85rem",
              color: "#666",
            }}
          >
            Start Date & Time
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* End Date & Time Section */}
          <Typography
            sx={{
              mb: 1.5,
              fontWeight: 500,
              fontSize: "0.85rem",
              color: "#666",
            }}
          >
            End Date & Time
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* CREATE Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
                px: 5,
                py: 1,
                fontWeight: 500,
                borderRadius: 1,
                textTransform: "none",
                fontSize: "0.9rem",
              }}
            >
              CREATE
            </Button>
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
}