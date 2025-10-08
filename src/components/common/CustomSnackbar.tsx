//components/common/CustomSnackbar.tsx
"use client";

import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  severity?: AlertColor; // 'error' | 'warning' | 'info' | 'success'
  onClose: () => void;
  autoHideDuration?: number;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  message,
  severity = "info",
  onClose,
  autoHideDuration = 4000, // default 4s
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%",
          fontFamily: "Helvetica Now Display, Arial, sans-serif",
          fontWeight: 700,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
