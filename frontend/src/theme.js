import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
    background: { default: "#ffffff", paper: "#1e1e1e" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    h2: { fontWeight: 600 },
  },
});

export default theme;
