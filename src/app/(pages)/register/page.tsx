"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BackgroundImg from "@/assests/images/background.png";
import LogoImg from "@/assests/images/Logo.png";
import UnderlineImg from "@/assests/images/Underline.png";
import PanelImg from "@/assests/images/Panel.png";
import GradientButton from "@/components/common/GradientButton";
import VerifyEmail from "@/components/VerifyEmail";

import { useRegisterMutation } from "@/redux/services/auth/authApi";
import CustomSnackbar from "@/components/common/CustomSnackbar";

const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const handleSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const [register, { isLoading }] = useRegisterMutation();

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      handleSnackbar("Please enter email and password", "warning");
      return;
    }

    try {
      await register({ email, password }).unwrap();
      handleSnackbar("Registration successful! Please verify your email.", "success");
      setShowVerify(true); // show verification screen
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Registration failed", "error");
    }
  };

  if (showVerify) {
    return <VerifyEmail email={email} />;
  }

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
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Image src={LogoImg} alt="Logo" />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image src={UnderlineImg} alt="Underline" width={100} height={10} />
        </Box>

        <Typography variant="h1" color="text.primary" gutterBottom>
          Sign Up
        </Typography>

        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
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
                sx: { borderRadius: 2, "& .MuiInputBase-input": { padding: "10px" } },
              }}
            />
          </Box>

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
                sx: { borderRadius: 2, "& .MuiInputBase-input": { padding: "10px" } },
              }}
            />
          </Box>
        </Stack>

        <GradientButton
          text="Sign Up"
          onClick={handleSignUp}
          width="80%"
          fontSize="1rem"
          disabled={isLoading}
        />

        <Typography variant="body1" color="text.primary" sx={{ mt: 2, textAlign: "center" }}>
          Already registered?{" "}
          <Link href="/login" style={{ color: "black", textDecoration: "none" }}>
            <strong
              style={{ color: "black", cursor: "pointer" }}
              onMouseOver={(e) => ((e.target as HTMLElement).style.textDecoration = "underline")}
              onMouseOut={(e) => ((e.target as HTMLElement).style.textDecoration = "none")}
            >
              Log In
            </strong>
          </Link>
        </Typography>
      </Paper>

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default Register;
