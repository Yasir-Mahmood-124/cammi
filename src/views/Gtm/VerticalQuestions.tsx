"use client";

import React from "react";
import { Box, Typography, Card } from "@mui/material";

interface VerticalQuestionsProps {
  previousQuestions: string[];
  currentQuestion: string;
}

const VerticalQuestions: React.FC<VerticalQuestionsProps> = ({
  previousQuestions,
  currentQuestion,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: 300,
        mx: "auto",
      }}
    >
      {/* Previous Questions */}
      {previousQuestions.map((q, idx) => (
        <Card
          key={idx}
          sx={{
            background:
              "linear-gradient(266deg, #F34A84 -0.23%, #5D8AC6 93.46%)",
            color: "#fff",
            borderRadius: 2,
            p: 2,
            boxShadow: "none",
          }}
        >
          <Typography variant="body2">{q}</Typography>
        </Card>
      ))}

      {/* Current Question with animated gradient border */}
      <Card
        sx={{
          position: "relative",
          p: 2,
          borderRadius: 3, // <-- rounded corners
          boxShadow: "none",
          background: "#fff",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            padding: "2px", // border thickness
            borderRadius: "inherit",
            background:
              "linear-gradient(270deg, #F34A84, #5D8AC6, #F34A84)",
            backgroundSize: "300% 300%",
            animation: "moveBorder 4s linear infinite",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            maskComposite: "exclude",
          },
        }}
      >
        <Typography variant="body2">{currentQuestion}</Typography>
      </Card>

      {/* Keyframes for border animation */}
      <style jsx global>{`
        @keyframes moveBorder {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </Box>
  );
};

export default VerticalQuestions;
