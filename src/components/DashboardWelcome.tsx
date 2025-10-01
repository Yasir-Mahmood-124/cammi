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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSubmenuClicked,
  loadSubmenuFromStorage,
} from "@/redux/services/features/submenuSlice";
 
import Gtm from "@/views/Gtm";
import Icp from "@/views/Icp";
import Kmf from "@/views/kmf";
import Sr from "@/views/sr";
import Bs from "@/views/Bs";
import Linkdin from "@/views/linkedin";
import EventsComponent from "@/views/events";
 
const GeneralStragicDocument = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Gtm />
  </Box>
);
 
const IdealCustomerProfile = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Icp />
  </Box>
);
 
const StrategicRoadmap = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Sr />
  </Box>
);
 
const MessagingFramework = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Kmf />
  </Box>
);
 
const BrandStartegy = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Bs />
  </Box>
);
 
const LinkedIn = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Linkdin />
  </Box>
);
const Events = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <EventsComponent />
  </Box>
);
const Budget = ({ onBack }: { onBack: () => void }) => (
  <Box sx={{ p: 0 }}>
    <Typography variant="h4">Budget</Typography>
  </Box>
);
 
const DashboardWelcome: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
 
  const submenuClicked = useSelector(
    (state: RootState) => state.submenu.clicked
  );
 
  const [anchorEls, setAnchorEls] = useState<
    Record<string, HTMLElement | null>
  >({});
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [openCreateProject, setOpenCreateProject] = useState(false);
 
  useEffect(() => {
    dispatch(loadSubmenuFromStorage());
  }, [dispatch]);
 
  const sidebarData = [
    {
      label: "Clarify",
      key: "clarify",
      children: [
        { key: "gtm", label: "GTM Document" },
        { key: "icp", label: "Ideal Customer Profile" },
        { key: "kmf", label: "Key Messaging Framework" },
        { key: "sr", label: "Strategic Roadmap" },
        { key: "bs", label: "Business Strategy" },
      ],
    },
    {
      label: "Align",
      key: "align",
    },
    {
      label: "Mobilize",
      key: "mobilize",
    },
    {
      label: "Monitor",
      key: "monitor",
    },
    {
      label: "Iterate",
      key: "iterate",
    },
  ];
 
  const handleClick = (key: string, event: React.MouseEvent<HTMLElement>) => {
    const storedProject = localStorage.getItem("currentProject");
    if (!storedProject) {
      setOpenCreateProject(true);
      return;
    }
    setAnchorEls((prev) => ({ ...prev, [key]: event.currentTarget }));
  };
 
  const handleClose = (key: string) => {
    setAnchorEls((prev) => ({ ...prev, [key]: null }));
  };
 
  const renderActiveComponent = () => {
    switch (submenuClicked) {
      case "gtm":
        return (
          <GeneralStragicDocument
            onBack={() => dispatch(setSubmenuClicked(null))}
          />
        );
      case "icp":
        return (
          <IdealCustomerProfile
            onBack={() => dispatch(setSubmenuClicked(null))}
          />
        );
      case "sr":
        return (
          <StrategicRoadmap onBack={() => dispatch(setSubmenuClicked(null))} />
        );
 
      case "kmf":
        return (
          <MessagingFramework
            onBack={() => dispatch(setSubmenuClicked(null))}
          />
        );
      case "bs":
        return (
          <BrandStartegy onBack={() => dispatch(setSubmenuClicked(null))} />
        );
 
      case "linkedin":
        return <LinkedIn onBack={() => dispatch(setSubmenuClicked(null))} />;
 
      case "events":
        return <Events onBack={() => dispatch(setSubmenuClicked(null))} />;
      case "budget":
        return <Budget onBack={() => dispatch(setSubmenuClicked(null))} />;
      default:
        return null;
    }
  };
 
  if (submenuClicked) {
    return (
      <Box sx={{ width: "100%", height: "100vh", bgcolor: "#fff" }}>
        {renderActiveComponent()}
      </Box>
    );
  }
 
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box width="100%" sx={{ px: 5 }}>
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
              onClick={() => setOpenCreateProject(true)}
              sx={{
                color: "black",
                border: "2px solid black",
                borderRadius: "999px",
                px: 5,
                py: 0.2,
              }}
            >
              Select 
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
                  px: 0.5,
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
                {category.children && category.children.length > 0 ? (
                  category.children.map((child) => (
                    <MenuItem
                      key={child.key}
                      onClick={() => {
                        dispatch(setSubmenuClicked(child.key));
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
                  ))
                ) : (
                  <MenuItem
                    disabled
                    sx={{
                      fontStyle: "italic",
                      color: "#ffff",
                      borderRadius: "12px",
                      background:
                        "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
                    }}
                  >
                    Coming Soon 🚧
                  </MenuItem>
                )}
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
          },
        }}
      >
        <CreateProject
          onCreate={(data) => {
            console.log("New project created:", data);
            setSelectedProject(data.project);
            setOpenCreateProject(false);
          }}
        />
      </Dialog>
    </Container>
  );
};
 
export default DashboardWelcome;