"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PanelImg from "@/assests/images/Panel.png";
import { wsClient } from "@/redux/services/common/wsClient";
import mammoth from "mammoth";
import Cookies from "js-cookie";
import CustomSnackbar from "./CustomSnackbar"; 

interface UploadDocumentProps {
  document_type: string;
  wsUrl: string;
  onUploadComplete?: (data: any) => void;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({
  document_type,
  wsUrl,
  onUploadComplete,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileText, setFileText] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Connect to WebSocket on mount
  useEffect(() => {
    wsClient.connect(wsUrl);

    wsClient.onMessage((data: any) => {
      console.log("WebSocket response received:", data);

      if (onUploadComplete) {
        onUploadComplete(data); // send full response
      }

      if (data.status === "processing_complete") {
        setIsUploading(false);
      }
    });
  }, [wsUrl, onUploadComplete]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!["txt", "docx"].includes(ext || "")) {
      setSnackbar({
        open: true,
        message: "Only .txt and .docx files are allowed.",
        severity: "error",
      });
      setFileName(null);
      setFileText("");
      return;
    }

    setFileName(file.name);

    try {
      let text = "";

      if (ext === "txt") {
        text = await file.text();
      } else if (ext === "docx") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      }

      setFileText(text);
    } catch (err) {
      console.error("Error extracting text:", err);
      setSnackbar({
        open: true,
        message: "Failed to extract text from file.",
        severity: "error",
      });
    }
  };

const handleUpload = () => {
  if (!fileText) return;

  const session_id = Cookies.get("token");
  const storedProject =
    typeof window !== "undefined"
      ? localStorage.getItem("currentProject")
      : null;
  const project = storedProject ? JSON.parse(storedProject) : null;
  const project_id = project?.project_id;

  if (!session_id || !project_id) {
    setSnackbar({
      open: true,
      message: "Missing session_id or project_id",
      severity: "error",
    });
    return;
  }

  // ✅ Step 1: Convert to bytes to measure size
  const encoder = new TextEncoder();
  const encoded = encoder.encode(fileText);

  const MAX_SIZE = 90 * 1024; // keep a safe margin (120 KB)
  let safeText = fileText;

  // ✅ Step 2: Truncate if necessary
  if (encoded.length > MAX_SIZE) {
    console.warn(
      `File text is too large (${encoded.length} bytes). Truncating to ${MAX_SIZE} bytes.`
    );

    // find the largest substring within limit
    let sliceLength = fileText.length;
    while (encoder.encode(fileText.slice(0, sliceLength)).length > MAX_SIZE) {
      sliceLength -= 1000; // reduce in chunks for performance
    }
    safeText = fileText.slice(0, sliceLength);
  }

  const payload = {
    action: "startProcessing",
    session_id,
    project_id,
    document_type,
    text: safeText,
  };

  console.log(
    `Uploading document (size: ${encoder.encode(safeText).length} bytes)...`
  );

  setIsUploading(true);
  wsClient.send(payload);
};

  return (
    <>
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
            minHeight: 500,
            p: 5,
            borderRadius: "20px",
            textAlign: "center",
            backgroundImage: `url(${PanelImg.src})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <CloudUploadOutlinedIcon
              sx={{ fontSize: 60, color: "#000", mb: 2 }}
            />

            <Typography
              variant="h1"
              gutterBottom
              sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#000" }}
            >
              Please upload the GTM Document.
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "grey.700", fontSize: "0.9rem", mb: 3 }}
            >
              Upload .docx or .txt
            </Typography>

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
              disabled={isUploading}
            >
              Choose File
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

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

          <Stack justifyContent="center" alignItems="center" mt={4}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!fileText || isUploading}
              fullWidth
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
              {isUploading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Upload"
              )}
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default UploadDocument;
