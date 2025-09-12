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
        display: "flex",
        justifyContent: "center",
        mt: 2,
        px: 1,
      }}
    >
      <Card
        sx={{
          width: { xs: "95%", sm: "80%", md: "70%", lg: "70%" },
          height: { xs: "auto", lg: "200px" },
          background: "linear-gradient(270deg, #F6E9F8 0.94%, #D5E7F9 100%)",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center", // center vertically
          justifyContent: "flex-start",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          p: { xs: 3, md: 5 },
        }}
      >
        <CardContent
          sx={{
            textAlign: "left",
            width: "100%",
            p: 0, // remove default padding
          }}
        >
          <Typography
            variant="h2" // bigger heading
            fontWeight="bold"
            gutterBottom
          >
            {heading}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: "60%", // force wrapping
              lineHeight: 1.6,
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
