"use client";
 
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useTheme,
  alpha,
  Menu,
  MenuItem,
  Paper,
  Avatar,
  Dialog,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import CreateProject from "./CreateProject";
 
const DashboardWelcome: React.FC = () => {
  const theme = useTheme();
  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [openCreateProject, setOpenCreateProject] = useState(false);
 
  const sidebarData = [
    {
      label: "Clarity",
      key: "clarity",
      children: [{ key: "icp", label: "Ideal Customer Profile" }],
    },
    {
      label: "Align",
      key: "align",
      children: [{ key: "sr", label: "Strategic Roadmap" }],
    },
    {
      label: "Mobilize",
      key: "mobilize",
      children: [{ key: "kmf", label: "Messaging Framework" }],
    },
    {
      label: "Monitor",
      key: "monitor",
      children: [{ key: "bi", label: "Brand Identity" }],
    },
    {
      label: "Iterate",
      key: "iterate",
      children: [{ key: "budget", label: "Budget" }],
    },
  ];
 
  useEffect(() => {
    const storedProject = localStorage.getItem("projectId");
    if (storedProject) {
      setSelectedProject(storedProject);
    }
  }, []);
 
  const handleClick = (key: string, event: React.MouseEvent<HTMLElement>) => {
    const storedProject = localStorage.getItem("projectId");
 
    if (!storedProject) {
      setOpenCreateProject(true);
      return;
    }
 
    setAnchorEls((prev) => ({ ...prev, [key]: event.currentTarget }));
  };
 
  const handleClose = (key: string) => {
    setAnchorEls((prev) => ({ ...prev, [key]: null }));
  };
 
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box width="100%" sx={{ px: 5 }}>
        {/* 🔍 Search Bar */}
        <Box sx={{ px: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
                backgroundColor: "#f5f5f5",
              },
              "& input": {
                padding: "8px",
              },
            }}
          />
        </Box>
 
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 5,
            background: "linear-gradient(135deg, #D5E7F9 0%, #F6E9F8 100%)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            textAlign: "flex-start",
            pb: "50px",
          }}
        >
          <Typography variant="h3" fontWeight="bold" color="black">
            Welcome to Cammi.
          </Typography>
          <Typography fontWeight="bold" fontSize="15px" color="black" mb={3}>
            Your AI-powered marketing BFF
          </Typography>
 
          <Box display="flex" gap={2} justifyContent="flex-start">
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenCreateProject(true)}
              sx={{
                background: "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
                color: "white",
                borderRadius: "999px",
                px: 5,
                py: 0.2,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #d53a70 0%, #3f6fa3 100%)",
                },
              }}
            >
              Create
            </Button>
 
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "black",
                border: "2px solid black",
                borderRadius: "999px",
                px: 5,
                py: 0.2,
              }}
            >
              Learn More
            </Button>
          </Box>
        </Paper>
 
        <Box
          mt={4}
          display="flex"
          justifyContent="center"
          gap={2}
          flexWrap="wrap"
        >
          {sidebarData.map((category) => (
            <Box key={category.key}>
              <Button
                variant="contained"
                endIcon={<ExpandMore />}
                onClick={(e) => handleClick(category.key, e)}
                sx={{
                  borderRadius: 10,
                  textTransform: "none",
                  backgroundColor: "#CFE6F8",
                  color: "black",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  px: 1,
                  py: 1,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  "&:hover": {
                    backgroundColor: "#f4f4f4",
                  },
                  "& .MuiButton-endIcon": {
                    marginLeft: "8px",
                    display: "flex",
                    alignItems: "center",
                    "& svg": {
                      fontSize: "36px !important",
                    },
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "#fff",
                    color: "#000",
                    fontSize: 30,
                    fontWeight: "bold",
                  }}
                >
                  {category.label.charAt(0)}
                </Avatar>
                {category.label}
              </Button>
 
              <Menu
                anchorEl={anchorEls[category.key]}
                open={Boolean(anchorEls[category.key])}
                onClose={() => handleClose(category.key)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{
                  sx: {
                    bgcolor: "#CFE6F8",
                    mt: "10px",
                  },
                }}
              >
                {category.children.map((child) => (
                  <MenuItem
                    key={child.key}
                    onClick={() => {
                      console.log("Selected:", child.label);
                      handleClose(category.key);
                    }}
                    sx={{
                      color: "black",
                      "&:hover": {
                        bgcolor: "white",
                        color: "black",
                      },
                    }}
                  >
                    {child.label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ))}
        </Box>
      </Box>
 
      <Dialog
        open={openCreateProject}
        onClose={() => setOpenCreateProject(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            // background: "linear-gradient(135deg, #F6F8FB 0%, #E6EEF8 100%)",
          },
        }}
      >
        <CreateProject
          onCreate={(data) => {
            console.log("New project created:", data);

            localStorage.getItem("currentProject");

            setSelectedProject(data.project);
            setOpenCreateProject(false);
          }}
        />
      </Dialog>
    </Container>
  );
};
 
export default DashboardWelcome;