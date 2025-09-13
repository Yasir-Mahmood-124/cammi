"use client";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
  ListItemIcon,
  Collapse,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/services/auth/authApi";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Cookies from "js-cookie";
import Logo from "../../../assests/images/Logo.png";

import { useGetUserProjectsQuery } from "@/redux/services/projects/projectApi";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSubmenuClicked,
  loadSubmenuFromStorage,
} from "@/redux/services/features/submenuSlice";

// Icons
import ArticleIcon from "@mui/icons-material/Article";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EventIcon from "@mui/icons-material/Event";
import FacebookIcon from "@mui/icons-material/Facebook";
import CodeIcon from "@mui/icons-material/Code";

import DashboardWelcome from "@/components/DashboardWelcome";
import Gtm from "@/views/Gtm";

// Dummy Component
function DummyPage({ title }: { title: string }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is under development. Stay tuned!
      </Typography>
    </Box>
  );
}

export type TabKey =
  | "gtm"
  | "icp"
  | "kmf"
  | "sr"
  | "bs"
  | "linkedin"
  | "events"
  | "facebook"
  | "brand-guidelines"
  | "moniter-dummy"
  | "iterate-dummy"
  | "bi"
  | "budget";

interface SidebarCategory {
  label: string;
  key: string;
  children?: {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    disabled?: boolean;
  }[];
}

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMainTab, setOpenMainTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [projectName, setProjectName] = useState<string | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutApi] = useLogoutMutation();
  // const subMenuclicked = localStorage.getItem("subMenuclicked");
  // const [submenuClicked, setSubmenuClicked] = useState<string | null>(null);

  const { data: projectsData, isLoading: projectsLoading } =
    useGetUserProjectsQuery();

  const submenuClicked = useSelector(
    (state: RootState) => state.submenu.clicked
  );

  useEffect(() => {
    dispatch(loadSubmenuFromStorage());
  }, [dispatch]);

  useEffect(() => {
    const stored = localStorage.getItem("currentProject");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProjectName(parsed.project_name);
      } catch {
        setProjectName(null);
      }
    }
  }, []);
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const stored = localStorage.getItem("subMenuclicked");
  //     setSubmenuClicked(stored);
  //   }
  // }, []);
  const handleLogout = async () => {
    setShowLoader(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      localStorage.removeItem("currentProject");
      localStorage.removeItem("linkedin_sub");

      await logoutApi({ token }).unwrap();
      Cookies.remove("token");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setShowLoader(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar structure
  const sidebarData: SidebarCategory[] = [
    {
      label: "Smart Scheduler",
      key: "smart-scheduler",
      children: [
        { key: "linkedin", label: "LinkedIn", icon: <LinkedInIcon /> },
        { key: "events", label: "Events", icon: <EventIcon /> },
        {
          key: "facebook",
          label: "Facebook (Coming Soon)",
          icon: <FacebookIcon />,
          disabled: true,
        },
      ],
    },
    {
      label: "Projects",
      key: "projects", // will be replaced dynamically
    },
    {
      label: "Templates",
      key: "templates",
      children: [
        { key: "gtm", label: "GTM", icon: <ArticleIcon /> },
        { key: "icp", label: "ICP Generation", icon: <LightbulbIcon /> },
        {
          key: "kmf",
          label: "Key Messaging Framework",
          icon: <CreateIcon />,
        },
        {
          key: "sr",
          label: "Strategic Roadmap",
          icon: <CreateIcon />,
        },
        {
          key: "bs",
          label: "Brand Strategy",
          icon: <CreateIcon />,
        },
      ],
    },
    {
      label: "Clarity",
      key: "clarity",
      children: [
        { key: "icp", label: "Ideal Customer Profile", icon: <CreateIcon /> },
      ],
    },
    {
      label: "Align",
      key: "align",
      children: [
        { key: "sr", label: "Strategic Roadmap", icon: <CreateIcon /> },
      ],
    },
    {
      label: "Mobilize",
      key: "mobilize",
      children: [
        { key: "kmf", label: "Messaging Framework", icon: <CreateIcon /> },
      ],
    },
    {
      label: "Monitor",
      key: "monitor",
      children: [{ key: "bi", label: "Brand Identity", icon: <CreateIcon /> }],
    },
    {
      label: "Iterate",
      key: "iterate",
      children: [{ key: "budget", label: "Budget", icon: <CreateIcon /> }],
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: "210px",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        p: 2,
      }}
    >
      <Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Box
            component="img"
            src={Logo.src}
            alt="Example"
            sx={{ width: 100, height: "auto", ml: "30px" }}
          />
          <Divider
            sx={{ width: "260px", mt: 2, borderBottomWidth: 2, mb: "20px" }}
          />
        </Box>

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "210px" }}
        >
          <Box
            sx={{
              display: "inline-block",
              background: "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
              borderRadius: "0 20px 20px 0",
              px: 8,
              py: 0,
              boxShadow: 2,
              textAlign: "left",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Dashboard
            </Typography>
          </Box>
        </Box>

        <List>
          {sidebarData
            .filter((category) => {
              if (
                ["clarity", "align", "mobilize", "monitor", "iterate"].includes(
                  category.key
                )
              ) {
                return !!submenuClicked;
              }
              return true;
            })
            .map((category) => (
              <Box key={category.key}>
                <ListItemButton
                  onClick={() =>
                    setOpenMainTab((prev) =>
                      prev === category.key ? null : category.key
                    )
                  }
                  sx={{ fontWeight: "bold" }}
                >
                  <ListItemText primary={category.label} />
                  {openMainTab === category.key ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>

                <Collapse
                  in={openMainTab === category.key}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {/* 🔹 Render static children */}
                    {category.children?.map((child) => (
                      <ListItemButton
                        key={child.key}
                        selected={activeTab === child.key}
                        disabled={child.disabled}
                        // onClick={() => {
                        //   if (!child.disabled) {
                        //     setActiveTab(child.key);
                        //     if (isMobile) setMobileOpen(false);
                        //   }
                        // }}
                        onClick={() => {
                          if (!child.disabled) {
                            setActiveTab(child.key);
                            dispatch(setSubmenuClicked(child.key));
                            setSubmenuClicked(child.key); // 👈 update state immediately
                            if (isMobile) setMobileOpen(false);
                          }
                        }}
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}

                    {/* 🔹 Render projects dynamically inside "Projects" */}
                    {category.key === "projects" && (
                      <>
                        {projectsLoading && (
                          <Typography
                            sx={{
                              pl: 4,
                              py: 1,
                              fontStyle: "italic",
                              color: "text.secondary",
                            }}
                          >
                            Loading projects...
                          </Typography>
                        )}

                        {!projectsLoading &&
                          projectsData?.projects?.length === 0 && (
                            <Typography
                              sx={{
                                pl: 4,
                                py: 1,
                                fontStyle: "italic",
                                color: "text.secondary",
                              }}
                            >
                              No projects found.
                            </Typography>
                          )}

                        {projectsData?.projects?.map((project: any) => (
                          <ListItemButton
                            key={project.project_id}
                            onClick={() => {
                              localStorage.setItem(
                                "currentProject",
                                JSON.stringify(project)
                              );
                              setProjectName(project.project_name);
                              if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                              mb: 1,
                              borderRadius: "9999px",
                              px: "2px",
                              py: "5px",
                              textAlign: "center",
                              background:
                                projectName === project.project_name
                                  ? "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)"
                                  : "transparent",
                              color:
                                projectName === project.project_name
                                  ? "primary.contrastText"
                                  : "text.primary",
                              "&:hover": {
                                background:
                                  projectName === project.project_name
                                    ? "linear-gradient(90deg, #D63A73 0%, #3F7BB5 100%)"
                                    : "action.hover",
                              },
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color:
                                  projectName === project.project_name
                                    ? "primary.contrastText"
                                    : "primary.main",
                                minWidth: 10,
                              }}
                            >
                              {/* <CodeIcon fontSize="small" /> */}
                            </ListItemIcon>
                            <ListItemText
                              primary={project.project_name}
                              primaryTypographyProps={{
                                fontWeight:
                                  projectName === project.project_name
                                    ? "bold"
                                    : "medium",
                                fontSize: "0.9rem",
                              }}
                              secondaryTypographyProps={{
                                fontSize: "0.75rem",
                                color:
                                  projectName === project.project_name
                                    ? "primary.contrastText"
                                    : "text.secondary",
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </>
                    )}
                  </List>
                </Collapse>
              </Box>
            ))}
        </List>
      </Box>

      <Box>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const renderContent = () => {
    if (!activeTab) {
      return <DashboardWelcome />;
    }

    switch (activeTab) {
      case "brand-guidelines":
        return <DummyPage title="Brand Guidelines" />;
      case "moniter-dummy":
        return <DummyPage title="Moniter Tool (Coming Soon)" />;
      case "iterate-dummy":
        return <DummyPage title="Iterate Tool (Coming Soon)" />;
      case "facebook":
        return <DummyPage title="Facebook Scheduler (Coming Soon)" />;
      default:
        return <DashboardWelcome />;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      {/* AppBar for Mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
              Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      {isMobile ? (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: "240px",
            flexShrink: 0,
            backgroundColor: "background.paper",
            boxShadow: 3,
          }}
        >
          {drawerContent}
        </Box>
      )}

      {/* Main content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", mt: isMobile ? 8 : 0 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}



// "use client";
// import React from 'react';
// import Icp from '@/views/Icp';
// import Gtm from '@/views/Gtm';

// const DashboardPage = () => {
//   return (
//     <div>
//         <Gtm />
//         {/* <Icp /> */}
//     </div>
//   )
// }


// export default DashboardPage;