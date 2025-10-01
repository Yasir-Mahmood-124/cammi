"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Cookies from "js-cookie";
import GradientButton from "./common/GradientButton";
import CustomSnackbar from "./common/CustomSnackbar";
import {
  useCreateProjectMutation,
  useGetSpecificOrganizationsQuery,
  useGetSpecificProjectsQuery,
} from "@/redux/services/projects/projectsApi";

interface CreateProjectProps {
  onCreate: (data: { project: string; organization: string }) => void;
}

export default function CreateProject({ onCreate }: CreateProjectProps) {
  const session_id = Cookies.get("token") || "";

  const [mode, setMode] = useState<
    "createNew" | "createExisting" | "selectExisting"
  >("createNew");
  const [organization, setOrganization] = useState("");
  const [project, setProject] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  // Fetch organizations with session_id in headers
  const { data: orgData, isLoading: orgLoading } =
    useGetSpecificOrganizationsQuery(
      { session_id },
      { skip: mode === "createNew" }
    );

  // Fetch projects with organization_id in headers (auto runs when selectedOrgId changes)
  const { data: projectData, isLoading: projectLoading } =
    useGetSpecificProjectsQuery(
      { organization_id: selectedOrgId },
      { skip: !selectedOrgId || mode !== "selectExisting" }
    );

  const [createProjectApi, { isLoading: creating }] =
    useCreateProjectMutation();

  const handleSubmit = async () => {
    try {
      if (mode === "createNew") {
        if (!organization || !project) {
          return showSnackbar(
            "Please enter organization and project name",
            "warning"
          );
        }

        const response: any = await createProjectApi({
          session_id,
          organization_name: organization,
          project_name: project,
        }).unwrap();

        saveAndNotify(response, "Project created successfully!");
      }

      if (mode === "createExisting") {
        if (!orgData?.organizations?.length) {
          return showSnackbar(
            "No organizations found. Please create one first.",
            "warning"
          );
        }
        if (!selectedOrgId || !project) {
          return showSnackbar(
            "Please select organization and enter project name",
            "warning"
          );
        }

        const orgName = orgData.organizations.find(
          (o: any) => o.id === selectedOrgId
        )?.organization_name;

        const response: any = await createProjectApi({
          session_id,
          organization_name: orgName,
          project_name: project,
        }).unwrap();

        saveAndNotify(response, "Project created successfully!");
      }

      if (mode === "selectExisting") {
        if (!orgData?.organizations?.length) {
          return showSnackbar(
            "No organizations found. Please create one first.",
            "warning"
          );
        }
        if (!selectedOrgId || !selectedProjectId) {
          return showSnackbar(
            "Please select organization and project",
            "warning"
          );
        }

        localStorage.setItem(
          "currentProject",
          JSON.stringify({
            organization_id: selectedOrgId,
            project_id: selectedProjectId,
          })
        );

        showSnackbar("Project selected successfully!", "success");

        onCreate({
          project: projectData?.projects.find(
            (p: any) => p.id === selectedProjectId
          )?.project_name,
          organization: orgData?.organizations.find(
            (o: any) => o.id === selectedOrgId
          )?.organization_name,
        });
      }
    } catch (err: any) {
      showSnackbar(err?.data?.message || "Operation failed", "error");
    }
  };

  const saveAndNotify = (response: any, message: string) => {
    localStorage.setItem(
      "currentProject",
      JSON.stringify({
        organization_id: response.organization_id,
        project_id: response.project_id,
      })
    );
    showSnackbar(message, "success");
    onCreate({
      project,
      organization: response.organization_name || organization,
    });

    // Reset form
    setOrganization("");
    setProject("");
    setSelectedOrgId("");
    setSelectedProjectId("");
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Card sx={{ width: 500, borderRadius: 5, p: 3, textAlign: "center" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Project Setup
          </Typography>

          {/* Mode selector */}
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <RadioGroup
              row
              value={mode}
              onChange={(e) => {
                setMode(e.target.value as any);
                setOrganization("");
                setProject("");
                setSelectedOrgId("");
                setSelectedProjectId("");
              }}
            >
              <FormControlLabel
                value="createNew"
                control={<Radio color="primary" />}
                label="Create New"
              />
              <FormControlLabel
                value="createExisting"
                control={<Radio color="primary" />}
                label="Create in Existing"
              />
              <FormControlLabel
                value="selectExisting"
                control={<Radio color="primary" />}
                label="Select Existing"
              />
            </RadioGroup>
          </FormControl>

          {/* Create New */}
          {mode === "createNew" && (
            <>
              <TextField
                placeholder="Organization Name"
                fullWidth
                size="small"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                placeholder="Project Name"
                fullWidth
                size="small"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}

          {/* Create in Existing */}
          {mode === "createExisting" && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="org-label">Organization</InputLabel>
                <Select
                  labelId="org-label"
                  label="Organization"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {orgLoading && <MenuItem disabled>Loading...</MenuItem>}
                  {orgData?.organizations?.map((org: any) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.organization_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Project Name"
                placeholder="Enter Project Name"
                fullWidth
                size="small"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                sx={{ mb: 2 }}
              />
            </>
          )}

          {/* Select Existing */}
          {mode === "selectExisting" && (
            <>
              {/* Org dropdown */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="select-org-label">Organization</InputLabel>
                <Select
                  labelId="select-org-label"
                  label="Organization"
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                >
                  <MenuItem value="">-- Select --</MenuItem>
                  {orgLoading && <MenuItem disabled>Loading...</MenuItem>}
                  {orgData?.organizations?.map((org: any) => (
                    <MenuItem key={org.id} value={org.id}>
                      {org.organization_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Project dropdown */}
              {selectedOrgId && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="select-project-label">Project</InputLabel>
                  <Select
                    labelId="select-project-label"
                    label="Project"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    {projectLoading && <MenuItem disabled>Loading...</MenuItem>}
                    {projectData?.projects?.map((p: any) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.project_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </>
          )}

          <GradientButton
            text={creating ? <CircularProgress size={20} /> : "Submit"}
            onClick={handleSubmit}
            disabled={creating}
          />
        </CardContent>
      </Card>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
}
