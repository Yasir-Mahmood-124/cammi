"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import type { AlertColor } from "@mui/material/Alert";
import DocumentSelector from "@/components/common/documentSelector";
import UploadDocument from "@/components/common/UploadDocument";
import GradientCard from "@/components/common/GradientCard";
import { useGet_unanswered_questionsQuery } from "@/redux/services/common/getUnansweredQuestionsApi";
import { useGetQuestionsQuery } from "@/redux/services/common/getQuestionsApi";
import UserInput from "./UserInput";
import VerticalQuestions from "./VerticalQuestions";
import FinalPreview, { QAItem } from "./FinalPreview";
import CustomSnackbar from "@/components/common/CustomSnackbar";

interface IcpProps {
  document_type?: string;
  wsUrl?: string;
}

// Define workflow states
type WorkflowState = "selection" | "upload" | "user-input" | "final-preview";

const Icp: React.FC<IcpProps> = ({
  document_type = "icp",
  wsUrl = "wss://91vm5ilj37.execute-api.us-east-1.amazonaws.com/dev",
}) => {
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);
  const [workflowState, setWorkflowState] =
    useState<WorkflowState>("selection");
  const [questionsForInput, setQuestionsForInput] = useState<string[]>([]);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info" as AlertColor,
  });

  // Edit state for FinalPreview
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const storedProject =
    typeof window !== "undefined"
      ? localStorage.getItem("currentProject")
      : null;
  const project = storedProject ? JSON.parse(storedProject) : null;
  const project_id = project?.project_id;

  // Get unanswered questions (NO flow)
  const {
    data: unansweredData,
    error: unansweredError,
    isLoading: unansweredLoading,
  } = useGet_unanswered_questionsQuery(
    { project_id, document_type },
    { skip: selection !== "no" || !project_id }
  );

  // Get all questions from backend (for final preview)
  const {
    data: fullQuestionsData,
    isLoading: fullLoading,
    error: fullError,
    refetch: refetchFullQuestions,
  } = useGetQuestionsQuery(
    { project_id, document_type },
    { skip: !project_id || workflowState !== "final-preview" }
  );

  // Handle selection between Yes/No
  const handleSelection = (value: "yes" | "no") => {
    setSelection(value);

    if (value === "yes") {
      setWorkflowState("upload");
    } else {
      // NO flow: check if we have unanswered questions
      setWorkflowState("user-input"); // Will be handled by useEffect
    }
  };

  // Handle NO flow - check unanswered questions
  useEffect(() => {
    if (
      selection === "no" &&
      unansweredData &&
      workflowState === "user-input"
    ) {
      if (
        unansweredData.missing_questions &&
        unansweredData.missing_questions.length > 0
      ) {
        // Has unanswered questions - show user input
        setQuestionsForInput(unansweredData.missing_questions);
      } else {
        // No unanswered questions - go directly to final preview
        setWorkflowState("final-preview");
      }
    }
  }, [selection, unansweredData, workflowState]);

  // Handle upload completion (YES flow)
  const handleUploadComplete = (response: any) => {
    if (
      response.status === "questions_need_answers" &&
      response.not_found_questions?.length > 0
    ) {
      // Explicit unanswered questions step
      const questions = response.not_found_questions.map(
        (q: any) => q.question
      );
      setQuestionsForInput(questions);
      setWorkflowState("user-input");

      //Show snackbar
      setSnackbar({
        open: true,
        severity: "warning",
        message: "Some questions need your input!",
      });
    } else if (response.status === "processing_complete") {
      // Check if processing results still contain unanswered ("Not Found") answers
      const unanswered = Object.entries(response.results || {})
        .filter(([_, answer]) => answer === "Not Found")
        .map(([question]) => question);

      if (unanswered.length > 0) {
        setQuestionsForInput(unanswered);
        setWorkflowState("user-input");

        //Show snackbar
        setSnackbar({
          open: true,
          severity: "warning",
          message: "Some answers are missing. Please fill them in.",
        });
      } else {
        setWorkflowState("final-preview");

        // Show snackbar
        setSnackbar({
          open: true,
          severity: "success",
          message: "All questions answered! Ready for preview.",
        });
      }
    }
  };

  // Handle user input completion
  const handleUserInputClose = () => {
    setWorkflowState("final-preview");
  };

  // Handle questions update during user input
  const handleUpdateQuestions = useCallback(
    (prevQs: string[], currentQ: string) => {
      setPreviousQuestions(prevQs);
      setCurrentQuestion(currentQ);
    },
    []
  );

  // Handle edit index change
  const handleEditChange = (index: number | null) => {
    setEditIndex(index);
  };

  // Handle save (after editing)
  const handleSave = (updatedQa: QAItem[]) => {
    // Optionally refetch data to get the latest from backend
    refetchFullQuestions();
  };

  // Render loading state
  const renderLoading = (message: string) => (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <p>{message}</p>
    </Box>
  );

  // Render error state
  const renderError = (message: string) => (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <p style={{ color: "red" }}>{message}</p>
    </Box>
  );

  // Render user input with questions panel
  const renderUserInputWithPanel = () => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "flex-start",
        width: "100%",
      }}
    >
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
          questions={questionsForInput}
          document_type={document_type}
          onUpdateQuestions={handleUpdateQuestions}
          onDialogClose={handleUserInputClose}
        />
      </Box>
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
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        mt: 4,
        mb: 4,
        px: { xs: 2, md: 4 },
      }}
    >
      <GradientCard
        heading="ICP Document Generation"
        content="A comprehensive framework capturing all key elements required to execute a successful go-to-market plan."
      />

      {/* Step 1: Selection */}
      {workflowState === "selection" && (
        <DocumentSelector onSelect={handleSelection} />
      )}

      {/* Step 2: Upload (YES flow only) */}
      {workflowState === "upload" && (
        <UploadDocument
          document_type={document_type}
          wsUrl={wsUrl}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Step 3: User Input */}
      {workflowState === "user-input" && (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "1rem",
            fontWeight: "500",
            width: "100%",
          }}
        >
          {/* Handle NO flow loading/error states */}
          {selection === "no" &&
            unansweredLoading &&
            renderLoading("Loading unanswered questions...")}
          {selection === "no" &&
            unansweredError &&
            renderError("Failed to load questions.")}

          {/* Show user input if we have questions */}
          {questionsForInput.length > 0 && renderUserInputWithPanel()}
        </Box>
      )}

      {/* Step 4: Final Preview */}
      {workflowState === "final-preview" && (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            fontSize: "1rem",
            fontWeight: "500",
            width: "100%",
          }}
        >
          {fullLoading && renderLoading("Loading questions...")}
          {fullError && renderError("Failed to load questions.")}

          {fullQuestionsData?.questions && (
            <FinalPreview
              data={fullQuestionsData.questions.map((q) => ({
                question: q.question_text,
                answer: q.answer_text || "",
              }))}
              editIndex={editIndex}
              onEditChange={handleEditChange}
              onSave={handleSave}
              document_type={document_type}
            />
          )}
        </Box>
      )}

      <CustomSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default Icp;
