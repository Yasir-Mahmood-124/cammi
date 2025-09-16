"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    IconButton,
    Button,
    LinearProgress,   // ✅ added
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import GradientButton from "@/components/common/GradientButton";
import { useUploadTextFileMutation } from "@/redux/services/common/uploadApiSlice";
import { useGetDocxFileMutation } from "@/redux/services/common/downloadApi";
import { useEditQuestionMutation } from "@/redux/services/common/editQuestion";
import Cookies from "js-cookie";
import DocumentActions from "./DocumentActions";

export interface QAItem {
    question: string;
    answer: string;
}

interface FinalPreviewProps {
    data: QAItem[];
    editIndex: number | null;
    onEditChange: (index: number | null) => void;
    onSave: (updatedData: QAItem[]) => void;
    document_type: string;
}

const FinalPreview: React.FC<FinalPreviewProps> = ({
    data,
    editIndex,
    onEditChange,
    onSave,
    document_type,
}) => {
    const [qaList, setQaList] = useState<QAItem[]>(data);
    const [editingAnswer, setEditingAnswer] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [uploadTextFile, { isLoading }] = useUploadTextFileMutation();
    const [getDocxFile] = useGetDocxFileMutation();
    const [editQuestion, { isLoading: isEditLoading }] = useEditQuestionMutation();

    const [wsActive, setWsActive] = useState(false);
    const [docReady, setDocReady] = useState(false);

    const [displayedContent, setDisplayedContent] = useState("");
    const pendingQueue = useRef<string[]>([]);
    const typingInterval = useRef<NodeJS.Timeout | null>(null);

    const [progress, setProgress] = useState<number>(0); // ✅ progress state

    // Update qaList when data prop changes
    useEffect(() => {
        setQaList(data);
    }, [data]);

    // Autofocus when editing and set initial editing value
    useEffect(() => {
        if (editIndex !== null && textareaRef.current) {
            setEditingAnswer(qaList[editIndex]?.answer || "");
            const textarea = textareaRef.current;
            textarea.focus();
            textarea.setSelectionRange(
                textarea.value.length,
                textarea.value.length
            );
        }
    }, [editIndex, qaList]);

    const handleAnswerChange = (value: string) => {
        setEditingAnswer(value);
    };

    const handleSaveClick = async () => {
        if (editIndex === null) return;

        try {
            const storedProject = localStorage.getItem("currentProject");
            const project = storedProject ? JSON.parse(storedProject) : null;
            const project_id = project?.project_id;

            if (!project_id) {
                console.error("No project_id found in localStorage");
                return;
            }

            await editQuestion({
                project_id,
                question_text: qaList[editIndex].question,
                answer_text: editingAnswer,
            }).unwrap();

            const updated = [...qaList];
            updated[editIndex].answer = editingAnswer;
            setQaList(updated);
            onSave(updated);
            onEditChange(null);

            console.log("✅ Question updated successfully");
        } catch (error) {
            console.error("❌ Failed to update question:", error);
        }
    };

    const handleCancelClick = () => {
        setEditingAnswer("");
        onEditChange(null);
    };

    const handleEditClick = (index: number) => {
        onEditChange(editIndex === index ? null : index);
    };

    // Typing effect function
    const startTyping = (text: string) => {
        let i = 0;
        typingInterval.current = setInterval(() => {
            setDisplayedContent((prev) => prev + text[i]);
            i++;
            if (i >= text.length) {
                clearInterval(typingInterval.current!);
                typingInterval.current = null;

                if (pendingQueue.current.length > 0) {
                    const nextMsg = pendingQueue.current.shift()!;
                    startTyping("\n\n" + nextMsg);
                }
            }
        }, 15);
    };

    // Upload + WebSocket
    const handleGenerateDocument = async () => {
        try {
            const dynamicFileName = "businessidea.txt";
            const savedToken = Cookies.get("token");
            const storedProject = localStorage.getItem("currentProject");
            const project = storedProject ? JSON.parse(storedProject) : null;
            const project_id = project?.project_id;

            const textContent = qaList
                .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
                .join("\n\n");

            const base64Content = btoa(unescape(encodeURIComponent(textContent)));

            const payload = {
                fileName: dynamicFileName,
                fileContent: base64Content,
                token: savedToken,
                project_id: project_id,
                document_type: document_type,
            };

            await uploadTextFile(payload).unwrap();
            console.log("✅ File uploaded successfully");

            setWsActive(true);
            setDisplayedContent("Waiting for WebSocket messages...");
            setDocReady(false);
            setProgress(0); // ✅ reset progress

            const ws = new WebSocket(
                `wss://4iqvtvmxle.execute-api.us-east-1.amazonaws.com/prod/?session_id=${savedToken}`
            );

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

                    // ✅ Handle progress updates
                    if (message.action === "sendMessage" && typeof message.body === "number") {
                        setProgress(message.body);
                        return;
                    }

                    if (
                        message.type === "tier_completion" &&
                        message.data?.content?.content
                    ) {
                        const newContent = message.data.content.content;

                        if (typingInterval.current) {
                            pendingQueue.current.push(newContent);
                        } else {
                            startTyping(
                                displayedContent === "Waiting for WebSocket messages..."
                                    ? newContent
                                    : "\n\n" + newContent
                            );
                        }
                    }

                    if (
                        message.action === "sendMessage" &&
                        message.body === "Document generated successfully!"
                    ) {
                        console.log("✅ Document generation completed!");
                        ws.close();
                        setWsActive(false);
                        setDocReady(true);
                        setProgress(100); // ✅ ensure full
                    }
                } catch (err) {
                    console.error("❌ Failed parsing WS message", err);
                }
            };

            ws.onerror = (err) => {
                console.error("❌ WebSocket error:", err);
                setDisplayedContent("WebSocket connection error.");
                setWsActive(false);
            };

            ws.onclose = (event) => {
                console.log("🔗 WebSocket closed:", event.code, event.reason);
                setWsActive(false);
            };
        } catch (err) {
            console.error("❌ Upload/WebSocket failed", err);
            setWsActive(false);
        }
    };

    return (
        <Card
            sx={{
                width: "100%",
                background: "#ECECEC",
                borderRadius: 3,
                boxShadow: "none",
                p: 3,
            }}
        >
            {/* Show Q&A before generating */}
            {!wsActive && !docReady && (
                <>
                    {qaList.map((qa, idx) => (
                        <Card
                            key={idx}
                            sx={{
                                background: "#fff",
                                border: "0.5px solid #000",
                                borderRadius: 2,
                                boxShadow: "none",
                                p: 2,
                                mb: 2,
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                            }}
                        >
                            {/* Question + Edit Button */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                    {qa.question}
                                </Typography>

                                <IconButton
                                    onClick={() => handleEditClick(idx)}
                                    disabled={isEditLoading}
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
                                    <EditIcon sx={{ fontSize: 16, color: "#000" }} />
                                </IconButton>
                            </Box>

                            {/* Answer / Edit Mode */}
                            <Box sx={{ mt: 1, minHeight: "40px" }}>
                                {editIndex === idx ? (
                                    <>
                                        <Box
                                            sx={{
                                                position: "relative",
                                                borderRadius: "12px",
                                                padding: "2px",
                                                background:
                                                    "linear-gradient(90deg, #d93d76, #3b6db0, #d93d76)",
                                                backgroundSize: "200% 100%",
                                                animation: "gradientMove 3s linear infinite",
                                                display: "flex",
                                            }}
                                        >
                                            <TextareaAutosize
                                                ref={textareaRef}
                                                value={editingAnswer}
                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                style={{
                                                    width: "100%",
                                                    minHeight: "60px",
                                                    lineHeight: "1.5",
                                                    resize: "none",
                                                    outline: "none",
                                                    fontSize: "14px",
                                                    fontFamily: "inherit",
                                                    padding: "6px 8px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    background: "#fff",
                                                    color: "#000",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 2,
                                                mt: 2,
                                            }}
                                        >
                                            <GradientButton
                                                text={isEditLoading ? "Saving..." : "Save"}
                                                onClick={handleSaveClick}
                                                disabled={isEditLoading}
                                                width="120px"
                                                height="40px"
                                            />
                                            <Button
                                                onClick={handleCancelClick}
                                                disabled={isEditLoading}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>

                                        <style>
                                            {`
                        @keyframes gradientMove {
                          0% { background-position: 0% 50%; }
                          100% { background-position: 200% 50%; }
                        }
                      `}
                                        </style>
                                    </>
                                ) : (
                                    <Typography
                                        sx={{ color: "#555", fontSize: 14, fontWeight: 400 }}
                                    >
                                        {qa.answer}
                                    </Typography>
                                )}
                            </Box>
                        </Card>
                    ))}

                    {/* Generate Button */}
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <GradientButton
                            text={isLoading ? "Uploading..." : "Generate Document"}
                            onClick={handleGenerateDocument}
                            disabled={isLoading || editIndex !== null}
                        />
                    </Box>
                </>
            )}

            {/* Progress + Typing effect */}
            {wsActive && (
                <Box sx={{ mt: 2 }}>
                    {/* ✅ Progress bar */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            Generating Document...
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography
                            variant="caption"
                            sx={{ mt: 1, display: "block", textAlign: "right" }}
                        >
                            {progress.toFixed(0)}%
                        </Typography>
                    </Box>

                    {/* ✅ Typed messages */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: "#fff",
                            borderRadius: 2,
                            minHeight: "200px",
                            whiteSpace: "pre-line",
                            fontSize: "14px",
                            lineHeight: 1.5,
                            fontFamily: "monospace",
                        }}
                    >
                        {displayedContent}
                    </Box>
                </Box>
            )}

            {/* Final message */}
            {docReady && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, color: "green", mb: 2 }}
                    >
                        Your Document is Ready!
                    </Typography>

                    <DocumentActions document_type={document_type} />
                </Box>
            )}
        </Card>
    );
};

export default FinalPreview;
