"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PanelImg from "@/assests/images/Panel.png";

const UploadDocument: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    }
  };

  const handleUpload = () => {
    if (fileName) {
      console.log("Uploading:", fileName);
      // add your upload logic here
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          minHeight: 500, // ⬅️ ensures enough height
          p: 5,
          borderRadius: "20px",
          textAlign: "center",
          backgroundImage: `url(${PanelImg.src})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "transparent",

          display: "flex", // ⬅️ flex column
          flexDirection: "column",
          justifyContent: "space-between", // push Upload button to bottom
        }}
      >
        {/* Top Section */}
        <Box>
          {/* Upload Icon */}
          <CloudUploadOutlinedIcon
            sx={{ fontSize: 60, color: "#000", mb: 2 }}
          />

          {/* Title */}
          <Typography
            variant="h1"
            gutterBottom
            sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#000" }}
          >
            Please upload the GTM Document.
          </Typography>

          {/* Subtext */}
          <Typography
            variant="body2"
            sx={{ color: "grey.700", fontSize: "0.9rem", mb: 3 }}
          >
            Upload a .pdf, .docs or .txt
          </Typography>

          {/* File Input */}
          <Button
            variant="outlined"
            component="label"
            sx={{
              border: "2px dashed #9e9e9e",
              color: "#616161",
              px: 4,
              py: 1,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                border: "2px dashed #616161",
                backgroundColor: "rgba(0,0,0,0.03)",
              },
            }}
          >
            Choose File
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {/* Show selected file name */}
          {fileName && (
            <Typography
              variant="body2"
              sx={{
                color: "#424242",
                mt: 2,
                wordBreak: "break-word",
                overflowWrap: "break-word",
                maxWidth: "100%",
              }}
            >
              {fileName}
            </Typography>
          )}
        </Box>

        {/* Bottom Section - Upload Button */}
        <Stack justifyContent="center" alignItems="center" mt={4}>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!fileName}
            fullWidth // ⬅️ makes it span full width of parent
            sx={{
              background: "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
              color: "#ffffff",
              py: 1.4,
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
            Upload
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UploadDocument;
