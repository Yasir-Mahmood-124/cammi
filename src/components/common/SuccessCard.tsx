"use client";

import React from "react";
import { Box, Typography, useTheme, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface SuccessCardProps {
  onClose: () => void; // required callback to close dialog
}

const SuccessCard: React.FC<SuccessCardProps> = ({ onClose }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 400,
        maxWidth: "90vw",
        background: "linear-gradient(270deg, #F6E9F8 0.94%, #D5E7F9 100%)",
        borderRadius: 2,
        padding: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Close icon */}
      <IconButton
        onClick={onClose} // close dialog
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: "black",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="h1"
        sx={{
          color: theme.palette.text.primary,
          fontWeight: "bold",
        }}
      >
        Thank You!
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.primary,
          mt: 2,
        }}
      >
        All your inputs have been submitted successfully, you can generate your document now.
      </Typography>

      <Box
        sx={{
          mt: 4,
          width: 60,
          height: 60,
          borderRadius: "50%",
          backgroundColor: "green",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckIcon sx={{ color: "white", fontSize: 32 }} />
      </Box>
    </Box>
  );
};

export default SuccessCard;
