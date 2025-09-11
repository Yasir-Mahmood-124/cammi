"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import BackgroundImg from "@/assests/images/background.png";
import VerifyEmailBg from "@/assests/images/verifyEmailBg.png";
import LogoImg from "@/assests/images/Logo.png";
import GradientButton from "@/components/GradientButton";

// ✅ Accept email as a prop
interface VerifyEmailProps {
  email: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${BackgroundImg.src})`, // ✅ full screen background
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
          backgroundImage: `url(${VerifyEmailBg.src})`, // ✅ card background
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

        {/* Heading */}
        <Typography variant="h1" color="text.primary" gutterBottom>
          Verify Email
        </Typography>

        {/* Info Text */}
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ mb: 3, textAlign: "center" }}
        >
          A verification email has been sent to{" "}
          <strong>{email}</strong>. <br />
          Please enter the code below to activate your account.
        </Typography>

        {/* Verification Code Input */}
        <Box sx={{ textAlign: "left", width: "80%", mx: "auto" }}>
          <TextField
            fullWidth
            placeholder="Verification Code"
            variant="outlined"
            InputProps={{
              sx: {
                borderRadius: 2,
                borderColor: "grey.400",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "grey.400",
                  },
                  "&:hover fieldset": {
                    borderColor: "grey.600",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "grey.800",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "10px",
                },
              },
            }}
          />
        </Box>

        {/* Verify Button */}
        <GradientButton
          text="Verify Email"
          onClick={() => console.log("Verify clicked")}
          width="80%"
          fontSize="1rem"
        />

        {/* Footer Link */}
        <Typography
          variant="body1"
          color="text.primary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          Already registered?{" "}
          <Link
            href="/login"
            style={{
              color: "black",
              textDecoration: "none",
            }}
          >
            <strong
              style={{ color: "black", cursor: "pointer" }}
              onMouseOver={(e) =>
                ((e.target as HTMLElement).style.textDecoration = "underline")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLElement).style.textDecoration = "none")
              }
            >
              Log In
            </strong>
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
