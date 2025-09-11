"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Paper, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BackgroundImg from "@/assests/images/background.png";
import PanelImg from "@/assests/images/Panel.png";
import GradientButton from "@/components/GradientButton";
import CustomSnackbar from "@/components/CustomSnackbar";

import { useForgotPasswordMutation, useResetPasswordMutation } from "@/redux/services/auth/authApi";

const ResetPassword = () => {
  const router = useRouter();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info" | "warning">("info");

  const handleSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSendResetCode = async () => {
    if (!email) {
      handleSnackbar("Please enter your email", "warning");
      return;
    }
    try {
      const response = await forgotPassword({ email }).unwrap();
      handleSnackbar(response.message, "success");
      setIsCodeSent(true); // move to reset password step
      // keep the email for the reset API
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Failed to send reset code", "error");
    }
  };

  const handleResetPassword = async () => {
    if (!verificationCode || !newPassword) {
      handleSnackbar("Please enter code and new password", "warning");
      return;
    }
    try {
      await resetPassword({
        email,
        code: verificationCode,
        newPassword,
      }).unwrap(); // if successful, proceeds
      handleSnackbar("Password reset successful. Redirecting to login...", "success");

      // Clear fields
      setVerificationCode("");
      setNewPassword("");

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Failed to reset password", "error");
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
        {/* Heading */}
        <Typography variant="h1" color="text.primary" gutterBottom>
          {isCodeSent ? "Reset Password" : "Forgot Password"}
        </Typography>

        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          {!isCodeSent ? (
            // Step 1: Forgot Password - Enter Email
            <Box sx={{ width: "80%" }}>
              <TextField
                fullWidth
                placeholder="Enter verification email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  sx: {
                    borderRadius: 2,
                    "& .MuiInputBase-input": { padding: "10px" },
                  },
                }}
              />
              <GradientButton
                text={isSendingCode ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Send Reset Code"}
                onClick={handleSendResetCode}
                width="100%"
                fontSize="1rem"
                disabled={isSendingCode}
              />
            </Box>
          ) : (
            // Step 2: Reset Password Form
            <>
              {/* Verification Code Field */}
              <Box sx={{ textAlign: "left", width: "80%" }}>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Verification Code
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter your verification code"
                  variant="outlined"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      "& .MuiInputBase-input": { padding: "10px" },
                    },
                  }}
                />
              </Box>

              {/* New Password Field */}
              <Box sx={{ textAlign: "left", width: "80%" }}>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Enter new password"
                  variant="outlined"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      "& .MuiInputBase-input": { padding: "10px" },
                    },
                  }}
                />
              </Box>

              {/* Reset Password Button */}
              <GradientButton
                text={isResetting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Reset Password"}
                onClick={handleResetPassword}
                width="80%"
                fontSize="1rem"
                disabled={isResetting}
              />
            </>
          )}
        </Stack>

        {/* Back to login */}
        <Typography variant="body1" color="text.primary" sx={{ mt: 2, textAlign: "center" }}>
          Remembered your password?{" "}
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

export default ResetPassword;
