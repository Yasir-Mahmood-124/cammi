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
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/redux/services/auth/authApi";
import Cookies from "js-cookie";
import Logo from "../../../assests/images/Logo.png";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setSubmenuClicked,
  loadSubmenuFromStorage,
  clearSubmenu,
} from "@/redux/services/features/submenuSlice";

// Icons
import ArticleIcon from "@mui/icons-material/Article";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CreateIcon from "@mui/icons-material/Create";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EventIcon from "@mui/icons-material/Event";
import FacebookIcon from "@mui/icons-material/Facebook";

import DashboardWelcome from "@/components/DashboardWelcome";

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
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
}

export default function DashboardPage() {
  const [openMainTab, setOpenMainTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutApi] = useLogoutMutation();

  const [selectedData, setSelectedData] = useState<{
    organization: string;
    project: string;
  } | null>(null);

  const submenuClicked = useSelector(
    (state: RootState) => state.submenu.clicked
  );

  useEffect(() => {
    dispatch(loadSubmenuFromStorage());
  }, [dispatch]);

  //Load OrganizationName and ProjectName from the localStorage as well.
  useEffect(() => {
    const updateData = () => {
      const storedData = localStorage.getItem("selectedData");
      setSelectedData(storedData ? JSON.parse(storedData) : null);
    };

    updateData(); // run initially

    window.addEventListener("selectedDataChanged", updateData);
    return () => {
      window.removeEventListener("selectedDataChanged", updateData);
    };
  }, []);

  const handleLogout = async () => {
    setShowLoader(true);
    try {
      const token = Cookies.get("token");
      if (!token) throw new Error("No token found");

      dispatch(clearSubmenu());

      await logoutApi({ token }).unwrap();
      Cookies.remove("token");
      localStorage.removeItem("linkedin_sub");
      localStorage.removeItem("subMenuclicked");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setShowLoader(false);
    }
  };

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
      label: "Templates",
      key: "templates",
    },
    {
      label: "Clarify",
      key: "clarify",
      children: [
        { key: "gtm", label: "GTM", icon: <ArticleIcon /> },
        { key: "icp", label: "ICP Generation", icon: <LightbulbIcon /> },
        { key: "kmf", label: "Key Messaging Framework", icon: <CreateIcon /> },
        { key: "sr", label: "Strategic Roadmap", icon: <CreateIcon /> },
        { key: "bs", label: "Brand Strategy", icon: <CreateIcon /> },
      ],
    },
    { label: "Align", key: "align" },
    { label: "Mobilize", key: "mobilize" },
    { label: "Monitor", key: "monitor" },
    { label: "Iterate", key: "iterate" },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: "210px",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
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
            sx={{ width: 100, height: "auto", ml: "30px", cursor: "pointer" }}
            onClick={() => {
              // 1️⃣ Remove from localStorage
              localStorage.removeItem("currentProject");
              localStorage.removeItem("subMenuclicked");
              localStorage.removeItem("selectedData");

              window.dispatchEvent(new Event("selectedDataChanged"));

              // 2️⃣ Clear Redux state
              dispatch(clearSubmenu());

              // 3️⃣ Reset active tab so DashboardWelcome shows
              setActiveTab(null);
              setOpenMainTab(null);

              // If you want to route to a landing page explicitly
              // router.push("/dashboard"); // or your home route
            }}
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
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mt: 2,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <List>
          {/* 🔥 Show Org/Project above Smart Scheduler */}
          {selectedData && (
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                p: 2,
                mb: 2,
                backgroundColor: "#fff",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <Box
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#666",
                  mb: 0.5,
                }}
              >
                Organization
              </Box>
              <Box sx={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>
                {selectedData.organization}
              </Box>

              <Box
                sx={{ fontSize: "12px", fontWeight: 500, color: "#666", mt: 1 }}
              >
                Project
              </Box>
              <Box sx={{ fontSize: "14px", fontWeight: 600, color: "#222" }}>
                {selectedData.project}
              </Box>
            </Box>
          )}
          {sidebarData
            .filter((category) => {
              if (
                ["clarify", "align", "mobilize", "monitor", "iterate"].includes(
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
                  onClick={() => {
                    if (category.key === "smart-scheduler") {
                      const currentProject =
                        localStorage.getItem("currentProject");
                      if (!currentProject) {
                        alert("⚠️ Please select or create a project first!");
                        return;
                      }
                    }

                    setOpenMainTab((prev) =>
                      prev === category.key ? null : category.key
                    );
                  }}
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
                    {category.children &&
                      category.children.length > 0 &&
                      category.children.map((child) => (
                        <ListItemButton
                          key={child.key}
                          selected={activeTab === child.key}
                          disabled={child.disabled}
                          onClick={() => {
                            if (!child.disabled) {
                              setActiveTab(child.key);
                              dispatch(setSubmenuClicked(child.key));
                            }
                          }}
                        >
                          <ListItemIcon>{child.icon}</ListItemIcon>
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      ))}

                    {!category.children && (
                      <ListItemButton
                        disabled
                        sx={{
                          justifyContent: "center",
                          textAlign: "center",
                          px: 0,
                        }}
                      >
                        <ListItemText
                          primary="Coming Soon 🚧"
                          sx={{
                            fontStyle: "italic",
                            color: "#ffff",
                            borderRadius: "12px",
                            background:
                              "linear-gradient(90deg, #EF4681 0%, #4F8CCA 100%)",
                          }}
                        />
                      </ListItemButton>
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
      <Box
        sx={{
          width: "240px",
          flexShrink: 0,
          backgroundColor: "background.paper",
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {drawerContent}
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}
