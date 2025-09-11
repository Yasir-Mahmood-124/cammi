"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#ef4681", // Pink
    },
    secondary: {
      main: "#4f8cca", // Blue
    },
    grey: {
      500: "#c3c7cd",
    },
    text: {
      primary: "#000000", // Pure Black
      secondary: "#ffffff", // Pure White
    },
  },
  typography: {
    fontFamily: "Helvetica Now Display, Arial, sans-serif",
    h1: {
      fontSize: "1.5rem", // 24px
      fontWeight: 700, // Bold
    },
    body1: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400, // Regular
    },
    body2: {
      fontSize: "1rem", // 16px
      fontWeight: 700, // Bold
    },
  },
});

// Make fonts responsive
theme = responsiveFontSizes(theme);

export default theme;
