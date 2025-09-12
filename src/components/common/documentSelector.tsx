"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PanelImg from "@/assests/images/Panel.png"; // ✅ panel image

interface DocumentSelectorProps {
  onSelect?: (value: "yes" | "no") => void;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({ onSelect }) => {
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);

  const handleSelect = (value: "yes" | "no") => {
    setSelection(value);
    if (onSelect) onSelect(value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa", // ✅ simple light background (page)
        
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420, // ✅ same as before
          padding: "100px",
          paddingX: 5,
          borderRadius: "20px",
          textAlign: "center",
          backgroundImage: `url(${PanelImg.src})`, // ✅ panel as background
          backgroundSize: "contain", // ✅ fit inside card
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "transparent",
        }}
      >
        {/* Heading */}
        <Typography
          variant="h1"
          gutterBottom
          sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#000" }}
        >
          Do you have a strategic document <br /> for this project?
        </Typography>

        {/* Icon */}
        <InsertDriveFileIcon
          sx={{ fontSize: 60, color: "#000000", my: 2 }}
        />

        {/* Subtext */}
        <Typography
          variant="body1"
          sx={{ color: "grey.800", fontSize: "0.9rem", mb: 4 }}
        >
          Please select an option to proceed
        </Typography>

        {/* Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          {/* No Button */}
          <Button
            variant="outlined"
            onClick={() => handleSelect("no")}
            sx={{
              border: "2px solid #000000",
              color: "#000000",
              px: 4,
              py: 1,
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                border: "2px solid #000000",
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            No
          </Button>

          {/* Yes Button */}
          <Button
            variant="contained"
            onClick={() => handleSelect("yes")}
            sx={{
              background: "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
              color: "#ffffff",
              px: 4,
              py: 1,
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
              "&:hover": {
                background: "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
                opacity: 0.9,
              },
            }}
          >
            Yes
          </Button>
        </Stack>

        {/* Show selected option */}
        {selection && (
          <Typography variant="body2" sx={{ mt: 3, fontWeight: "bold" }}>
            You selected: {selection.toUpperCase()}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DocumentSelector;
