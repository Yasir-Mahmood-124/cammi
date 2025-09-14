"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import DocumentSelector from "@/components/common/documentSelector";
import UploadDocument from "@/components/common/UploadDocument";
import GradientCard from "@/components/common/GradientCard";
import { useGet_unanswered_questionsQuery } from "@/redux/services/common/getUnansweredQuestionsApi";
import { useGetQuestionsQuery } from "@/redux/services/common/getQuestionsApi";
import UserInput from ".././Icp/UserInput";
import VerticalQuestions from ".././Icp/VerticalQuestions";
import FinalPreview, { QAItem } from ".././Icp/FinalPreview";

interface SrProps {
  document_type?: string;
  wsUrl?: string;
}

type WorkflowState =
  | "selection"
  | "upload"
  | "user-input"
  | "final-preview";

const Sr: React.FC<SrProps> = ({
  document_type = "sr",
  wsUrl = "wss://91vm5ilj37.execute-api.us-east-1.amazonaws.com/dev",
}) => {
  const [selection, setSelection] = useState<"yes" | "no" | null>(null);
  const [workflowState, setWorkflowState] =
    useState<WorkflowState>("selection");
  const [questionsForInput, setQuestionsForInput] = useState<string[]>([]);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const storedProject =
    typeof window !== "undefined"
      ? localStorage.getItem("currentProject")
      : null;
  const project = storedProject ? JSON.parse(storedProject) : null;
  const project_id = project?.project_id;

  const {
    data: unansweredData,
    error: unansweredError,
    isLoading: unansweredLoading,
  } = useGet_unanswered_questionsQuery(
    { project_id, document_type },
    { skip: selection !== "no" || !project_id }
  );

  const {
    data: fullQuestionsData,
    isLoading: fullLoading,
    error: fullError,
    refetch: refetchFullQuestions,
  } = useGetQuestionsQuery(
    { project_id, document_type },
    { skip: !project_id || workflowState !== "final-preview" }
  );

  const handleSelection = (value: "yes" | "no") => {
    setSelection(value);
    if (value === "yes") {
      setWorkflowState("upload");
    } else {
      setWorkflowState("user-input");
    }
  };

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
        setQuestionsForInput(unansweredData.missing_questions);
      } else {
        setWorkflowState("final-preview");
      }
    }
  }, [selection, unansweredData, workflowState]);

  const handleUploadComplete = (questions: string[]) => {
    if (questions.length > 0) {
      setQuestionsForInput(questions);
      setWorkflowState("user-input");
    } else {
      setWorkflowState("final-preview");
    }
  };

  const handleUserInputClose = () => {
    setWorkflowState("final-preview");
  };

  const handleUpdateQuestions = useCallback(
    (prevQs: string[], currentQ: string) => {
      setPreviousQuestions(prevQs);
      setCurrentQuestion(currentQ);
    },
    []
  );

  const handleEditChange = (index: number | null) => {
    setEditIndex(index);
  };

  const handleSave = (updatedQa: QAItem[]) => {
    refetchFullQuestions();
  };

  const renderLoading = (message: string) => (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <p>{message}</p>
    </Box>
  );

  const renderError = (message: string) => (
    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
      <p style={{ color: "red" }}>{message}</p>
    </Box>
  );

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
        heading="SR Document Generation"
        content="A structured framework to capture all key elements for a successful report."
      />

      {workflowState === "selection" && (
        <DocumentSelector onSelect={handleSelection} />
      )}

      {workflowState === "upload" && (
        <UploadDocument
          document_type={document_type}
          wsUrl={wsUrl}
          onUploadComplete={handleUploadComplete}
        />
      )}

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
          {selection === "no" &&
            unansweredLoading &&
            renderLoading("Loading unanswered questions...")}
          {selection === "no" &&
            unansweredError &&
            renderError("Failed to load questions.")}

          {questionsForInput.length > 0 && renderUserInputWithPanel()}
        </Box>
      )}

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
    </Box>
  );
};

export default Sr;
