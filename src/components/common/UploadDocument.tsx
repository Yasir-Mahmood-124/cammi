"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack, Paper, CircularProgress } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PanelImg from "@/assests/images/Panel.png";
import { wsClient } from "@/redux/services/common/wsClient";
import mammoth from "mammoth";
import Cookies from "js-cookie";

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

  // Connect to WebSocket on mount
  useEffect(() => {
    wsClient.connect(wsUrl);

    wsClient.onMessage((data: any) => {
      console.log("WebSocket response received:", data); // Log the response
      if (onUploadComplete) {
        onUploadComplete(data.questions || []);
      }
      // Stop loader once response received
      setIsUploading(false);
    });
  }, [wsUrl, onUploadComplete]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!["txt", "docx", "pdf"].includes(ext || "")) {
      alert("Only .txt, .docx, and .pdf files are allowed.");
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
      } else if (ext === "pdf") {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf: any = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        const pages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pages.push(content.items.map((item: any) => item.str).join(" "));
        }

        text = pages.join("\n");
      }

      setFileText(text);
    } catch (err) {
      console.error("Error extracting text:", err);
      alert("Failed to extract text from file.");
    }
  };

  const handleUpload = () => {
    if (!fileText) return;

    const session_id = Cookies.get("token");
    const storedProject =
      typeof window !== "undefined" ? localStorage.getItem("currentProject") : null;
    const project = storedProject ? JSON.parse(storedProject) : null;
    const project_id = project?.project_id;

    if (!session_id || !project_id) {
      alert("Missing session_id or project_id");
      return;
    }

    const payload = {
      action: "startProcessing",
      session_id,
      project_id,
      text: fileText,
    };

    console.log("Uploading document...", payload);

    setIsUploading(true);
    wsClient.send(payload);
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
          <CloudUploadOutlinedIcon sx={{ fontSize: 60, color: "#000", mb: 2 }} />

          <Typography
            variant="h1"
            gutterBottom
            sx={{ fontSize: "1.25rem", fontWeight: 700, color: "#000" }}
          >
            Please upload the {document_type.toUpperCase()} Document.
          </Typography>

          <Typography variant="body2" sx={{ color: "grey.700", fontSize: "0.9rem", mb: 3 }}>
            Upload a .pdf, .docx, or .txt
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
            disabled={isUploading} // Disable file input while uploading
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
            {isUploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default UploadDocument;