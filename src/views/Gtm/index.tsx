"use client";

import React, { useState, useCallback } from "react";
import GradientCard from "@/components/common/GradientCard";
import UserInput from "./UserInput";
import VerticalQuestions from "./VerticalQuestions";
import FinalPreview from "./FinalPreview"; // ✅ import FinalPreview
import { Box } from "@mui/material";

const Gtm = () => {
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const [qaData, setQaData] = useState<
    { question: string; answer: string }[] | null
  >(null); // ✅ store final Q/A from UserInput

  // ✅ Memoized callback to prevent infinite loop
  const handleUpdateQuestions = useCallback(
    (prevQs: string[], currentQ: string) => {
      setPreviousQuestions(prevQs);
      setCurrentQuestion(currentQ);
    },
    []
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        mt: 4,
        mb: 4,
        px: { xs: 2, md: 4 }, // shared left-right margin
      }}
    >
      {/* Full-width Top Banner */}
      <GradientCard
        heading="GTM Document Generation"
        content="A comprehensive framework capturing all key elements required to execute a successful go-to-market plan."
      />

      {/* Main Content */}
      {qaData ? (
        // ✅ Show FinalPreview if data exists
        <FinalPreview data={qaData} onEdit={(index) => console.log("Edit:", index)} />
      ) : (
        // ✅ Show UserInput + Sidebar otherwise
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
          }}
        >
          {/* Left column (User Input) */}
          <Box
            sx={{
              flex: 1,
              minWidth: 400,
              bgcolor: "#fff",
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
            }}
          >
            <UserInput
              onUpdateQuestions={handleUpdateQuestions}
              onDialogClose={(qa) => {
                console.log("Dialog closed! Final Q/A:", qa);
                setQaData(qa); // ✅ store Q/A → triggers FinalPreview
              }}
            />
          </Box>

          {/* Right column (Sidebar: Vertical Questions) */}
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
              flexShrink: 0,
              width: "auto",
              maxWidth: 300,
              alignSelf: "flex-start",
            }}
          >
            <VerticalQuestions
              previousQuestions={previousQuestions}
              currentQuestion={currentQuestion}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Gtm;


