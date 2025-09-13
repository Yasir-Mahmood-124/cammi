"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    IconButton,
    Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import GradientButton from "@/components/common/GradientButton";
import { useUploadTextFileMutation } from "@/redux/services/common/uploadApiSlice";
import { useGetDocxFileMutation } from "@/redux/services/common/downloadApi"; // ✅ import
import Cookies from "js-cookie";
import DocumentActions from "./DocumentActions";

interface QAItem {
    question: string;
    answer: string;
}

interface FinalPreviewProps {
    data: QAItem[];
    onEdit?: (updatedData: QAItem[]) => void;
}

const FinalPreview: React.FC<FinalPreviewProps> = ({ data, onEdit }) => {
    const [qaList, setQaList] = useState<QAItem[]>(data);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Upload mutation
    const [uploadTextFile, { isLoading }] = useUploadTextFileMutation();

    // Download mutation
    const [getDocxFile] = useGetDocxFileMutation();

    // WebSocket states
    const [wsActive, setWsActive] = useState(false);
    const [docReady, setDocReady] = useState(false);

    // Typing effect states
    const [displayedContent, setDisplayedContent] = useState("");
    const pendingQueue = useRef<string[]>([]);
    const typingInterval = useRef<NodeJS.Timeout | null>(null);

    // Autofocus when editing
    useEffect(() => {
        if (editIndex !== null && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus();
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    }, [editIndex]);

    const handleAnswerChange = (index: number, value: string) => {
        const updated = [...qaList];
        updated[index].answer = value;
        setQaList(updated);
    };

    const handleSave = () => {
        if (editIndex !== null) {
            onEdit?.(qaList);
            setEditIndex(null);
        }
    };

    const handleCancel = () => {
        setEditIndex(null);
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
            const project_id = JSON.parse(
                localStorage.getItem("currentProject") || "{}"
            ).project_id;

            const textContent = qaList
                .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
                .join("\n\n");

            const base64Content = btoa(unescape(encodeURIComponent(textContent)));

            const payload = {
                fileName: dynamicFileName,
                fileContent: base64Content,
                token: savedToken,
                project_id: project_id,
                document_type: "gtm",
            };

            await uploadTextFile(payload).unwrap();
            console.log("✅ File uploaded successfully");

            setWsActive(true);
            setDisplayedContent("Waiting for WebSocket messages...");
            setDocReady(false);

            const ws = new WebSocket(
                `wss://4iqvtvmxle.execute-api.us-east-1.amazonaws.com/prod/?session_id=${savedToken}`
            );

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);

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
            {/* 🔹 Show Q&A before generating */}
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
                                    onClick={() => setEditIndex(editIndex === idx ? null : idx)}
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

                            <Box sx={{ mt: 1, minHeight: "40px" }}>
                                {editIndex === idx ? (
                                    <>
                                        <TextareaAutosize
                                            ref={textareaRef}
                                            value={qa.answer}
                                            onChange={(e) => handleAnswerChange(idx, e.target.value)}
                                            style={{
                                                width: "100%",
                                                minHeight: "60px",
                                                resize: "none",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "14px",
                                                fontFamily: "inherit",
                                                padding: "8px",
                                                borderRadius: "inherit",
                                                background: "transparent",
                                                color: "#000",
                                            }}
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                gap: 2,
                                                mt: 2,
                                            }}
                                        >
                                            <GradientButton
                                                text="Save"
                                                onClick={handleSave}
                                                width="120px"
                                                height="40px"
                                            />
                                            <Button onClick={handleCancel}>Cancel</Button>
                                        </Box>
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
                            disabled={isLoading}
                        />
                    </Box>
                </>
            )}

            {/* 🔹 Typing effect */}
            {wsActive && (
                <Box
                    sx={{
                        mt: 2,
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
            )}

            {/* 🔹 Final message */}
            {docReady && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography
                        variant="body1"
                        sx={{ fontWeight: 700, color: "green", mb: 2 }}
                    >
                        Your Document is Ready!
                    </Typography>

                    <DocumentActions /> {/* ⬅️ Separate clean component */}
                </Box>
            )}

        </Card>
    );
};

export default FinalPreview;
