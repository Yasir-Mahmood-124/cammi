"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Paper, CircularProgress } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BackgroundImg from "@/assests/images/background.png";
import VerifyEmailBg from "@/assests/images/VerifyEmailBg.png";
import LogoImg from "@/assests/images/Logo.png";
import GradientButton from "@/components/common/GradientButton";
import CustomSnackbar from "@/components/common/CustomSnackbar";

import { useVerifyEmailMutation } from "@/redux/services/auth/authApi";

interface VerifyEmailProps {
  email: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email }) => {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const handleSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  const handleVerify = async () => {
    if (!code.trim()) {
      handleSnackbar("Please enter the verification code", "warning");
      return;
    }

    try {
      await verifyEmail({ email, code }).unwrap();
      handleSnackbar("Email verified successfully! Redirecting to login...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Verification failed", "error");
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
          maxWidth: { xs: "95%", sm: 500 },
          width: "100%",
          borderRadius: 0,
          boxShadow: "none",
          textAlign: "center",
          backgroundColor: "transparent",
          backgroundImage: `url(${VerifyEmailBg.src})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Image src={LogoImg} alt="Logo" />
        </Box>

        <Typography variant="h1" color="text.primary" gutterBottom>
          Verify Email
        </Typography>

        <Typography variant="body1" color="text.primary" sx={{ mb: 3, textAlign: "center" }}>
          A verification email has been sent to <strong>{email}</strong>.<br />
          Please enter the code below to activate your account.
        </Typography>

        <Box sx={{ textAlign: "left", width: "80%", mx: "auto", mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Verification Code"
            variant="outlined"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: 2,
                "& .MuiInputBase-input": { padding: "10px" },
              },
            }}
          />
        </Box>

        <GradientButton
          text={isLoading ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Verify Email"}
          onClick={handleVerify}
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

export default VerifyEmail;
