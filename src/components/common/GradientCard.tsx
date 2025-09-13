"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface GradientCardProps {
  heading: string;
  content: string;
}

const GradientCard: React.FC<GradientCardProps> = ({ heading, content }) => {
  return (
    <Box
      sx={{
        width: "100%",   // full width
      }}
    >
      <Card
        sx={{
          width: "100%",
          height: { xs: "auto", lg: "150px" },
          background: "linear-gradient(270deg, #F6E9F8 0.94%, #D5E7F9 100%)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
          p: { xs: 2, md: 3 },
        }}
      >
        <CardContent sx={{ textAlign: "left", width: "100%", p: 0 }}>
          <Typography variant="h5" fontWeight="600" gutterBottom>
            {heading}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: { xs: "100%", md: "70%" }, // responsive wrapping
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GradientCard;
