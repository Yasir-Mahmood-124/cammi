"use client";

import React from "react";
import GradientCard from "@/components/common/GradientCard";
import UserInput from "./UserInput";
import { Box } from "@mui/material";

const Gtm = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4, // vertical spacing between components
        mt: 4,  // top margin
        mb: 4,  // bottom margin
        px: 2,  // horizontal padding
      }}
    >
      <GradientCard
        heading="GTM Document Generation"
        content="A comprehensive framework capturing all key elements required to execute a successful go-to-market plan."
      />

      <UserInput />
    </Box>
  );
};

export default Gtm;
