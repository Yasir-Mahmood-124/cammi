"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Stack, Paper, CircularProgress } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BackgroundImg from "@/assests/images/background.png";
import PanelImg from "@/assests/images/Panel.png";
import GradientButton from "@/components/common/GradientButton";
import CustomSnackbar from "@/components/common/CustomSnackbar";

import { useForgotPasswordMutation, useVerifyCodeMutation, useResetPasswordMutation } from "@/redux/services/auth/authApi";

const ResetPassword = () => {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [forgotPassword, { isLoading: isSendingCode }] = useForgotPasswordMutation();
  const [verifyCode, { isLoading: isVerifying }] = useVerifyCodeMutation();
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
    if (!email.trim()) {
      handleSnackbar("Please enter your email", "warning");
      return;
    }
    try {
      const response = await forgotPassword({ email }).unwrap();
      handleSnackbar(response.message, "success");
      setStep(2); // move to verify code step
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Failed to send reset code", "error");
    }
  };

  const handleVerifyCode = async () => {
    if (!email.trim() || !verificationCode.trim()) {
      handleSnackbar("Please enter email and code", "warning");
      return;
    }
    try {
      const response = await verifyCode({ email, code: verificationCode }).unwrap();
      handleSnackbar(response.message, "success");
      setStep(3); // move to reset password step
    } catch (err: any) {
      handleSnackbar(err?.data?.message || "Verification failed", "error");
    }
  };

  const handleResetPassword = async () => {
    if (!email.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      handleSnackbar("Please fill all fields", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      handleSnackbar("Passwords do not match", "warning");
      return;
    }
    try {
      const response = await resetPassword({ email, newPassword, confirmPassword }).unwrap();
      handleSnackbar(response.message, "success");

      // Clear fields
      setVerificationCode("");
      setNewPassword("");
      setConfirmPassword("");

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
        <Typography variant="h1" color="text.primary" gutterBottom>
          {step === 1 ? "Forgot Password" : step === 2 ? "Verify Code" : "Reset Password"}
        </Typography>

        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          {step === 1 && (
            <Box sx={{ width: "80%" }}>
              <TextField
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ sx: { borderRadius: 2, "& .MuiInputBase-input": { padding: "10px" } } }}
              />
              <Box sx={{ mt: 3 }}>
                <GradientButton
                  text={isSendingCode ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Send Reset Code"}
                  onClick={handleSendResetCode}
                  width="100%"
                  fontSize="1rem"
                  disabled={isSendingCode}
                />
              </Box>
            </Box>
          )}

          {step === 2 && (
            <Box sx={{ width: "80%" }}>
              <TextField
                fullWidth
                placeholder="Enter verification code"
                variant="outlined"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                InputProps={{ sx: { borderRadius: 2, "& .MuiInputBase-input": { padding: "10px" } } }}
              />
              <Box sx={{ mt: 3 }}>
                <GradientButton
                  text={isVerifying ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Verify Code"}
                  onClick={handleVerifyCode}
                  width="100%"
                  fontSize="1rem"
                  disabled={isVerifying}
                />
              </Box>
            </Box>
          )}

          {step === 3 && (
            <>
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
                  InputProps={{ sx: { borderRadius: 2, "& .MuiInputBase-input": { padding: "10px" } } }}
                />
              </Box>

              <Box sx={{ textAlign: "left", width: "80%" }}>
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Confirm new password"
                  variant="outlined"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{ sx: { borderRadius: 2, "& .MuiInputBase-input": { padding: "10px" } } }}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <GradientButton
                  text={isResetting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Reset Password"}
                  onClick={handleResetPassword}
                  width="100%"
                  fontSize="1rem"
                  disabled={isResetting}
                />
              </Box>
            </>
          )}
        </Stack>

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
