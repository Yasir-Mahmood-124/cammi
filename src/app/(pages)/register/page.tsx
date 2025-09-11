"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import BackgroundImg from "@/assests/images/background.png";
import LogoImg from "@/assests/images/Logo.png";
import UnderlineImg from "@/assests/images/Underline.png";
import PanelImg from "@/assests/images/Panel.png";
import GradientButton from "@/components/GradientButton";
import VerifyEmail from "@/components/VerifyEmail"; // ✅ import VerifyEmail

const Register = () => {
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState(""); // ✅ state for email
  const [password, setPassword] = useState(""); // optional (for future use)

  // ✅ If user clicked "Sign Up", show VerifyEmail screen with email
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
          Sign Up
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
              onChange={(e) => setEmail(e.target.value)} // ✅ update email state
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
          </Box>
        </Stack>

        {/* Sign Up Button */}
        <GradientButton
          text="Sign Up"
          onClick={() => {
            if (email.trim()) {
              setShowVerify(true); // ✅ only switch if email entered
            } else {
              alert("Please enter a valid email.");
            }
          }}
          width="80%"
          fontSize="1rem"
        />

        {/* Already registered? */}
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
              style={{
                color: "black",
                cursor: "pointer",
              }}
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

export default Register;
