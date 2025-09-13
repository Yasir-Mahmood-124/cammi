"use client";

import React, { ReactNode } from "react";
import { Button } from "@mui/material";

interface GradientButtonProps {
  text: ReactNode; // <-- now accepts string or JSX
  onClick?: () => void;
  width?: string | number;
  fontSize?: string | number;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  height?: string | number;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  text,
  onClick,
  width = "80%",
  fontSize = "1rem",
  size = "medium",
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      disabled={disabled}
      sx={{
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
