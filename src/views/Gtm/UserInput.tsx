"use client";

import React, { useState } from "react";
import { Box, Typography, Card, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Autorenew as RefreshIcon } from "@mui/icons-material";

interface QAItem {
  question: string;
  answer?: string;
}

const qaList: QAItem[] = [
  { question: "What do you want to accomplish in one year?", answer: "Grow my business by 50%" },
  { question: "Where do you want to be in three years?", answer: "Expand to international markets" },
  { question: "Where is your short term focus?" },
  { question: "Tell us about your business?" },
  { question: "Tell us about who you sell to? Where are they located?" },
  { question: "What is unique about your business?", answer: "We offer 24/7 customer support" },
  { question: "What marketing tools do you have available to you?" },
  { question: "Who do you think are your biggest competitors?" },
  { question: "What are your strengths, weaknesses, opps and threats?" },
  { question: "Tell us about your product/solution/ service?" },
];

const UserInput: React.FC = () => {
  const [step, setStep] = useState(0);
  const [acceptedSteps, setAcceptedSteps] = useState<number[]>([]);
  const [input, setInput] = useState("");

  const handleAccept = () => {
    if (step < qaList.length) {
      setAcceptedSteps((prev) => [...prev, step]);
      setStep(step + 1);
    }
  };

  const handleReject = () => {
    if (step < qaList.length) {
      setStep(step + 1);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Main Card */}
      <Card
        sx={{
          width: "100%",
          background: "#ECECEC",
          borderRadius: 3,
          boxShadow: "none",
          p: 3,
        }}
      >
        {/* Render accepted and previous questions */}
        {qaList.slice(0, step).map((qa, idx) => (
          <Card
            key={idx}
            sx={{
              background: "#F7F7F7",
              border: "0.5px solid #000000",
              borderRadius: 2,
              boxShadow: "none",
              p: 2,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {qa.question}
              </Typography>
              {acceptedSteps.includes(idx) && (
                <CheckIcon sx={{ color: "green", fontSize: 20 }} />
              )}
            </Box>
            {qa.answer && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "#555", fontSize: 14, fontWeight: 400 }} // ✅ lighter font weight
              >
                {qa.answer}
              </Typography>
            )}
          </Card>
        ))}

        {/* Current Question */}
        {step < qaList.length && (
          <Card
            sx={{
              background: "#F7F7F7",
              border: "0.5px solid #000000",
              borderRadius: 2,
              boxShadow: "none",
              p: 2,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {qaList[step].question}
              </Typography>
              {/* Tick & Cross buttons */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={handleReject}
                  sx={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    p: 0,
                    "&:hover": { background: "#f0f0f0" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16, color: "#000" }} />
                </IconButton>
                <IconButton
                  onClick={handleAccept}
                  sx={{
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    width: 28,
                    height: 28,
                    p: 0,
                    "&:hover": { background: "#f0f0f0" },
                  }}
                >
                  <CheckIcon sx={{ fontSize: 16, color: "#000" }} />
                </IconButton>
              </Box>
            </Box>
            {qaList[step].answer && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "#555", fontSize: 14, fontWeight: 400 }} // ✅ lighter font weight
              >
                {qaList[step].answer}
              </Typography>
            )}
          </Card>
        )}
      </Card>

      {/* Textarea with Refresh Button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TextareaAutosize
          minRows={1}
          placeholder="Generate Professional Document in Seconds"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "0 8px",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
            height: "40px",
            lineHeight: "40px",
          }}
        />
        <IconButton sx={{ background: "#fff", border: "1px solid #ddd", p: "4px" }}>
          <RefreshIcon fontSize="small" sx={{ color: "#000" }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UserInput;
