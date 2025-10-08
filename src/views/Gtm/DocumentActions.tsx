"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import * as mammoth from "mammoth";
import GradientButton from "@/components/common/GradientButton";
import { useGetDocxFileMutation } from "@/redux/services/common/downloadApi";
import EditHeadingDialog from "./EditHeadingDialog";

const DocumentActions: React.FC = () => {
  const theme = useTheme();
  const [getDocxFile, { isLoading, isError, error }] = useGetDocxFileMutation();

  // State
  const [docContent, setDocContent] = useState("");
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // ✅ Prepare headers here (from localStorage + cookies)
  const [headers, setHeaders] = useState<{
    project_id: string;
    session_id: string;
    document_type: string;
  } | null>(null);

  useEffect(() => {
    try {
      // Get project_id from localStorage
      const projectData = localStorage.getItem("currentProject");
      const parsedProject = projectData ? JSON.parse(projectData) : null;
      const project_id = parsedProject?.project_id || "";

      // Get session_id (token) from cookies
      const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
      const session_id = match ? decodeURIComponent(match[2]) : "";

      // Hardcode document type
      const document_type = "gtm";

      if (project_id && session_id) {
        setHeaders({ project_id, session_id, document_type });
      } else {
        console.warn("⚠️ Missing project_id or session_id.");
      }
    } catch (err) {
      console.error("Error reading headers:", err);
    }
  }, []);

  // 🔹 Download as DOCX
  const handleDownload = async () => {
    try {
      const response = await getDocxFile().unwrap();
      console.log("📥 Full API Response:", response);

      const byteCharacters = atob(response.docxBase64);
      const byteArrays = [];
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }

      const blob = new Blob([new Uint8Array(byteArrays)], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = response.fileName || "document.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("❌ Download failed:", err);
    }
  };

  // 🔹 Fetch & View inline when template clicked
  const handleTemplateClick = async (themeKey: string) => {
    setSelectedTheme(themeKey);
    setViewLoading(true);

    try {
      const response = await getDocxFile().unwrap();
      const arrayBuffer = Uint8Array.from(atob(response.docxBase64), (c) =>
        c.charCodeAt(0)
      ).buffer;

      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocContent(result.value);
    } catch (err) {
      console.error("❌ View failed:", err);
    } finally {
      setViewLoading(false);
    }
  };

  // 🔹 Define template styles
  const templateStyles: Record<string, any> = {
    template1: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      "& h1, & h2, & h3": { color: theme.palette.primary.main },
    },
    template2: {
      backgroundColor: "#f0f8ff",
      color: "#003366",
      "& h1, & h2, & h3": { color: "#0066cc" },
      fontFamily: "Georgia, serif",
    },
    template3: {
      backgroundColor: "#1e1e2f",
      color: "#f5f5f5",
      "& h1, & h2, & h3": { color: "#ff9800" },
      fontFamily: "Courier New, monospace",
      padding: "20px",
      borderRadius: "10px",
    },
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Template Selection */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 3,
          flexWrap: "wrap",
          mb: 3,
        }}
      >
        {Object.keys(templateStyles).map((key) => (
          <Card
            key={key}
            onClick={() => handleTemplateClick(key)}
            sx={{
              width: 180,
              height: 120,
              cursor: "pointer",
              borderRadius: 2,
              boxShadow:
                selectedTheme === key
                  ? `0 0 10px ${theme.palette.primary.main}`
                  : 2,
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: `0 0 12px ${theme.palette.secondary.main}`,
              },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              p: 2,
              ...templateStyles[key],
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {key === "template1" && "Classic"}
                {key === "template2" && "Elegant"}
                {key === "template3" && "Dark Mode"}
              </Typography>
              <Typography variant="body2">Preview</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Document Preview */}
      <Box
        sx={{
          mb: 3,
          p: 3,
          borderRadius: 2,
          minHeight: 200,
          ...(selectedTheme ? templateStyles[selectedTheme] : {}),
        }}
      >
        {viewLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress sx={{ color: theme.palette.secondary.main }} />
          </Box>
        ) : docContent ? (
          <Box
            sx={{ "& p": { mb: 1.5, textAlign: "justify" } }}
            dangerouslySetInnerHTML={{ __html: docContent }}
          />
        ) : (
          <Typography sx={{ textAlign: "center", color: "gray" }}>
            👆 Select a template card to preview your document
          </Typography>
        )}
      </Box>

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <GradientButton
          text="Edit"
          width="150px"
          onClick={() => setEditDialogOpen(true)}
          disabled={!headers}
        />

        <GradientButton
          text={isLoading ? "Downloading..." : "Download"}
          width="150px"
          onClick={handleDownload}
          disabled={isLoading}
        />
      </Box>

      {isError && (
        <Typography sx={{ color: "red", mt: 2, textAlign: "center" }}>
          ❌ Error: {(error as any)?.data?.error || "Unknown error"}
        </Typography>
      )}

      {/* Edit Dialog */}
      {headers && (
        <EditHeadingDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          projectId={headers.project_id}
          sessionId={headers.session_id}
          documentType={headers.document_type}
        />
      )}
    </Box>
  );
};

export default DocumentActions;
