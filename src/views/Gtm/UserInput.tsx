"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Card,
  IconButton,
  CircularProgress,
  TextareaAutosize,
  Dialog,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Autorenew as RefreshIcon } from "@mui/icons-material";
import { GenerateCammi } from "@/assests/icons/index";
import { useRefineMutation } from "@/redux/services/common/refineApi";
import SuccessCard from "@/components/common/SuccessCard";

interface QAItem {
  question: string;
  answer?: string;
}

interface UserInputProps {
  onUpdateQuestions?: (prevQs: string[], currentQ: string) => void;
  onDialogClose?: (qa: { question: string; answer: string }[]) => void; // 🔹 pass full Q/A
}

const qaList: QAItem[] = [
  { question: "What do you want to accomplish in one year?" },
  { question: "Where do you want to be in three years?" },
  // { question: "Where is your short term focus?" },
  // { question: "Tell us about your business?" },
  // { question: "Tell us about who you sell to? Where are they located?" },
  // { question: "What is unique about your business?" },
  // { question: "What marketing tools do you have available to you?" },
  // { question: "Who do you think are your biggest competitors?" },
  // { question: "What are your strengths, weaknesses, opps and threats?" },
  // { question: "Tell us about your product/solution/ service?" },
];

const UserInput: React.FC<UserInputProps> = ({ onUpdateQuestions, onDialogClose }) => {
  const [step, setStep] = useState(0);
  const [acceptedSteps, setAcceptedSteps] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>(qaList.map(() => ""));
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [openDialog, setOpenDialog] = useState(false); // 🔹 for popup

  const [refine, { isLoading }] = useRefineMutation();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Typing animation
  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const currentAnswer = answers[step];
    const interval = setInterval(() => {
      if (i <= currentAnswer.length) {
        setTypingText(currentAnswer.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowActions(true);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isTyping, answers, step]);

  // Scroll into view + update questions
  useEffect(() => {
    const card = cardRefs.current[step];
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (onUpdateQuestions) {
      const prevQs = qaList.slice(0, step).map((q) => q.question);
      const currentQ = qaList[step]?.question || "";
      onUpdateQuestions(prevQs, currentQ);
    }
  }, [step, onUpdateQuestions]);

  const handleAccept = (idx: number) => {
    setAcceptedSteps((prev) => [...prev, idx]);
    setShowActions(false);
    setEditingStep(null);
    setTypingText("");
    if (idx === step) {
      if (step + 1 < qaList.length) {
        setStep(step + 1);
      } else {
        // 🔹 all questions done
        setOpenDialog(true);
      }
    }
  };

  const handleReject = (idx: number) => {
    setEditingStep(idx);
  };

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;
    try {
      setTypingText("");
      setShowActions(false);
      const response = await refine({ prompt: inputValue }).unwrap();
      setAnswers((prev) =>
        prev.map((ans, idx) => (idx === step ? response.groq_response : ans))
      );
      setIsTyping(true);
      setInputValue("");
    } catch (err) {
      console.error("Error refining prompt:", err);
    }
  };

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers((prev) => prev.map((ans, i) => (i === idx ? value : ans)));
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Questions Card */}
      <Card sx={{ width: "100%", background: "#ECECEC", borderRadius: 3, boxShadow: "none", p: 3 }}>
        {qaList.slice(0, step + 1).map((qa, idx) => {
          const isAccepted = acceptedSteps.includes(idx);
          const isEditing = editingStep === idx;

          return (
            <Card
              key={idx}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              sx={{
                background: isEditing ? "#FFFFFF" : "#F7F7F7",
                border: `0.5px solid ${isEditing ? "#ccc" : "#000"}`,
                borderRadius: 2,
                boxShadow: "none",
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Question + Actions */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {qa.question}
                </Typography>

                {((showActions && idx === step) || isEditing) && !isAccepted && (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton onClick={() => handleReject(idx)} sx={{ background: "#fff", border: "1px solid #ddd", borderRadius: "50%", width: 28, height: 28, p: 0, "&:hover": { background: "#f0f0f0" } }}>
                      <CloseIcon sx={{ fontSize: 16, color: "#000" }} />
                    </IconButton>
                    <IconButton onClick={() => handleAccept(idx)} sx={{ background: "#fff", border: "1px solid #ddd", borderRadius: "50%", width: 28, height: 28, p: 0, "&:hover": { background: "#f0f0f0" } }}>
                      <CheckIcon sx={{ fontSize: 16, color: "#000" }} />
                    </IconButton>
                  </Box>
                )}

                {isAccepted && !isEditing && <CheckIcon sx={{ fontSize: 20, color: "#4CAF50" }} />}
              </Box>

              {/* Answer / Typing */}
              <Box sx={{ mt: 1, minHeight: "40px" }}>
                {isEditing ? (
                  <TextareaAutosize
                    value={answers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 14,
                      border: "none",
                      outline: "none",
                      resize: "none",
                      fontFamily: "inherit",
                      backgroundColor: "#fff",
                      color: "#555",
                      padding: "4px",
                    }}
                    minRows={2}
                  />
                ) : isTyping && idx === step ? (
                  <Typography variant="body2" sx={{ color: "#555", fontSize: 14, fontWeight: 400 }}>
                    {typingText}
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: "#555", fontSize: 14, fontWeight: 400 }}>
                    {answers[idx]}
                  </Typography>
                )}
                {isLoading && idx === step && <CircularProgress size={20} />}
              </Box>
            </Card>
          );
        })}
      </Card>

      {/* Input + Buttons */}
      {step < qaList.length && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TextareaAutosize
            minRows={1}
            placeholder="Generate Professional Document in Seconds"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
              backgroundColor: "#FFFFFF",
              color: "#000000",
            }}
          />
          <IconButton onClick={() => setInputValue("")} sx={{ background: "#fff", border: "1px solid #ddd", p: "10px" }}>
            <RefreshIcon fontSize="small" sx={{ color: "#000" }} />
          </IconButton>
          <IconButton
            onClick={handleGenerate}
            sx={{
              background: "linear-gradient(266deg, #6389C4 -0.23%, #ED5088 93.46%)",
              borderRadius: 2,
              width: 50,
              height: 50,
              p: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": { opacity: 0.9 },
            }}
          >
            <GenerateCammi />
          </IconButton>
        </Box>
      )}

      {/* 🔹 Completion Popup */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          if (onDialogClose) {
            const qaData = qaList.map((q, idx) => ({
              question: q.question,
              answer: answers[idx] || "",
            }));
            onDialogClose(qaData); // send Q/A to parent
          }
        }}
        PaperProps={{
          sx: {
            border: "2px solid white",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
      >
        <SuccessCard
          onClose={() => {
            setOpenDialog(false);
            if (onDialogClose) {
              const qaData = qaList.map((q, idx) => ({
                question: q.question,
                answer: answers[idx] || "",
              }));
              onDialogClose(qaData);
            }
          }}
        />
      </Dialog>


    </Box>
  );
};

export default UserInput;
