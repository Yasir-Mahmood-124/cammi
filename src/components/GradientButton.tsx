"use client";

import React from "react";
import { Button } from "@mui/material";

interface GradientButtonProps {
  text: string;
  onClick?: () => void;
  width?: string | number;
  fontSize?: string | number;
  size?: "small" | "medium" | "large";
}

const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onClick,
  width = "80%", // default width
  fontSize = "1rem", // default font size
  size = "medium",
}) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      sx={{
        mt: 3,
        py: 1,
        px: 2,
        width: width,
        borderRadius: 3,
        fontWeight: 700,
        fontSize: fontSize,
        background: "linear-gradient(to right, #ef4681, #4f8cca)",
        color: "#fff",
        textTransform: "none",
        "&:hover": {
          background: "linear-gradient(to right, #d93d76, #3b6db0)",
        },
      }}
    >
      {text}
    </Button>
  );
};

export default GradientButton;
