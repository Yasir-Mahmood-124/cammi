"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Paper, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import BackgroundImg from "@/assests/images/background.png";
import LogoImg from "@/assests/images/Logo.png";
import UnderlineImg from "@/assests/images/Underline.png";
import PanelImg from "@/assests/images/Panel.png";
import GradientButton from "@/components/GradientButton";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useLoginMutation } from "@/redux/services/auth/authApi";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const handleSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    // Clear fields when showing snackbar
    setEmail("");
    setPassword("");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      handleSnackbar("Please enter email and password", "warning");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      Cookies.set("token", response.token, { expires: 7 });
      handleSnackbar("Login successful!", "success");
      setTimeout(() => router.push("/dashboard"), 500); // slight delay for snackbar
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Login failed", "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${BackgroundImg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          maxWidth: { xs: "95%", sm: 600 },
          width: "100%",
          borderRadius: 0,
          boxShadow: "none",
          textAlign: "center",
          backgroundColor: "transparent",
          backgroundImage: `url(${PanelImg.src})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Image src={LogoImg} alt="Logo" />
        </Box>

        {/* Underline */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image src={UnderlineImg} alt="Underline" width={100} height={10} />
        </Box>

        {/* Heading */}
        <Typography variant="h1" color="text.primary" gutterBottom>
          Log In
        </Typography>

        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          {/* Email Field */}
          <Box sx={{ textAlign: "left", width: "80%" }}>
            <Typography variant="body2" color="text.primary" gutterBottom>
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  "& .MuiInputBase-input": {
                    padding: "10px",
                  },
                },
              }}
            />
          </Box>

          {/* Password Field */}
          <Box sx={{ textAlign: "left", width: "80%" }}>
            <Typography variant="body2" color="text.primary" gutterBottom>
              Password
            </Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="Enter your password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: {
                  borderRadius: 2,
                  "& .MuiInputBase-input": {
                    padding: "10px",
                  },
                },
              }}
            />
            <Box sx={{ mt: 1, textAlign: "right" }}>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </Stack>

        {/* Login Button with Loader */}
        <GradientButton
          text={
            isLoading ? (
              <CircularProgress size={20} sx={{ color: "#fff" }} />
            ) : (
              "Log In"
            )
          }
          onClick={handleLogin}
          width="80%"
          fontSize="1rem"
          disabled={isLoading}
        />

        {/* Not registered yet? */}
        <Typography variant="body1" color="text.primary" sx={{ mt: 2, textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link href="/register" style={{ color: "black", textDecoration: "none" }}>
            <strong
              style={{ color: "black", cursor: "pointer" }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
            >
              Sign Up
            </strong>
          </Link>
        </Typography>
      </Paper>

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default Login;
