"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
} from "@mui/material";
import GradientButton from "./common/GradientButton";
import { useCreateProjectMutation } from "@/redux/services/projects/projectApi";
import CustomSnackbar from "./common/CustomSnackbar";

export default function CreateProject({
  onCreate,
}: {
  onCreate: (data: { project: string; organization: string }) => void;
}) {
  const [project, setProject] = useState("");
  const [organization, setOrganization] = useState("");

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error" | "info" | "warning">("info");

  // RTK Query mutation
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleSubmit = async () => {
    if (!project || !organization) {
      setSnackbarMessage("Both fields are required");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const payload = {
        project_name: project,
        organization_name: organization,
      };

      const response = await createProject(payload).unwrap();

      // ✅ Save response in localStorage
      localStorage.setItem("currentProject", JSON.stringify(response));

      // ✅ Show success message
      setSnackbarMessage("Project created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Call parent callback
      onCreate({ project, organization });

      // Reset form
      setProject("");
      setOrganization("");

      console.log("API Response:", response);
    } catch (err: any) {
      console.error("API Error:", err);

      // ❌ Show error message
      setSnackbarMessage(
        err?.data?.message || "Failed to create project. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          width: 400,
          borderRadius: 5,
          background: "linear-gradient(135deg, #F6F8FB 0%, #E6EEF8 100%)",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
            Create project
          </Typography>

          <Typography align="left" sx={{ fontWeight: "600" }}>
            Project name
          </Typography>
          <TextField
            placeholder="Enter name of your project"
            variant="outlined"
            fullWidth
            size="small"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            sx={{ mb: 3, borderRadius: 5 }}
          />

          <Typography align="left" sx={{ fontWeight: "600" }}>
            Organization
          </Typography>
          <TextField
            placeholder="Enter name of your organization"
            variant="outlined"
            fullWidth
            size="small"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            sx={{ mb: 3 }}
          />

          <GradientButton
            text={isLoading ? "Creating..." : "Create"}
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      {/* ✅ Snackbar for feedback */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={4000} // optional
      />
    </>
  );
}
