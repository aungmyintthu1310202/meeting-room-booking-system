import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  Grid,
  Fade,
  Zoom,
  alpha,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import {
  EventAvailable as EventIcon,
  AccessTime as TimeIcon,
  Today as TodayIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#e0e0e0",
  },
}));

// Base API URL
const API_BASE = "http://localhost:5000/api";

const CustomStepIcon = ({ active, completed, icon }) => {
  const icons = {
    1: <TodayIcon />,
    2: <ScheduleIcon />,
  };
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : completed
            ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            : "#f0f0f0",
        color: active || completed ? "#fff" : "#999",
        transition: "all 0.3s ease",
      }}
    >
      {completed ? <CheckIcon fontSize="small" /> : icons[icon]}
    </Box>
  );
};

export default function BookingForm({ onCreated }) {
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(0);
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
    setSuccess("");

    const startISO = combineDateTime(startDate, startTime);
    const endISO = combineDateTime(endDate, endTime);

    if (!startISO || !endISO) {
      setError("Please select both date and time for start and end.");
      return;
    }

    if (new Date(startISO) >= new Date(endISO)) {
      setError("End time must be after start time.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ startTime: startISO, endTime: endISO }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Failed to create booking");
        return;
      }

      setSuccess("Booking created successfully!");
      setStartDate(null);
      setStartTime(null);
      setEndDate(null);
      setEndTime(null);
      setActiveStep(0);
      onCreated && onCreated();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Server error");
    }
  }

  const isStepComplete = () => {
    return startDate && startTime && endDate && endTime;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Fade in timeout={500}>
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
          {/* Header with Gradient */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: 3,
              color: "#fff",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <EventIcon sx={{ fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Create Booking
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Schedule a meeting room for your team
            </Typography>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              connector={<CustomConnector />}
              sx={{ mb: 4, mt: 1 }}
            >
              <Step>
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon {...props} icon={1} />
                  )}
                >
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Start Time
                  </Typography>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  StepIconComponent={(props) => (
                    <CustomStepIcon {...props} icon={2} />
                  )}
                >
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    End Time
                  </Typography>
                </StepLabel>
              </Step>
            </Stepper>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Alerts */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert
                    severity="success"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setSuccess("")}
                  >
                    {success}
                  </Alert>
                </motion.div>
              )}

              <Grid container spacing={3}>
                {/* Start Section */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: alpha("#667eea", 0.04),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: alpha("#667eea", 0.08),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <TimeIcon sx={{ fontSize: 16, color: "#fff" }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1a1a2e" }}
                      >
                        Start Date & Time
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Start Date"
                          value={startDate}
                          onChange={(newValue) => {
                            setStartDate(newValue);
                            setActiveStep(startTime ? 1 : 0);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "medium",
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#667eea",
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="Start Time"
                          value={startTime}
                          onChange={(newValue) => {
                            setStartTime(newValue);
                            setActiveStep(newValue ? 1 : 0);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "medium",
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#667eea",
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* End Section */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: alpha("#764ba2", 0.04),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: alpha("#764ba2", 0.08),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ScheduleIcon sx={{ fontSize: 16, color: "#fff" }} />
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#1a1a2e" }}
                      >
                        End Date & Time
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="End Date"
                          value={endDate}
                          onChange={(newValue) => {
                            setEndDate(newValue);
                            setActiveStep(endTime ? 2 : 1);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "medium",
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#764ba2",
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="End Time"
                          value={endTime}
                          onChange={(newValue) => {
                            setEndTime(newValue);
                            setActiveStep(newValue ? 2 : 1);
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "medium",
                              sx: {
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: "#764ba2",
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>

              {/* Create Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Zoom in={isStepComplete()} timeout={300}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isStepComplete()}
                    sx={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                      px: 5,
                      py: 1.2,
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: "0 4px 14px rgba(102, 126, 234, 0.4)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
                      },
                      "&:disabled": {
                        background: "#ccc",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Create Booking
                  </Button>
                </Zoom>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </LocalizationProvider>
  );
}