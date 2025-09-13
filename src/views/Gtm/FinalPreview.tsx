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
import Cookies from "js-cookie"; // ✅ to read token from cookies

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

    // ✅ hook from RTK query
    const [uploadTextFile, { isLoading, isSuccess, isError, error }] =
        useUploadTextFileMutation();

    // ✅ Autofocus and move cursor to end when edit mode enabled
    useEffect(() => {
        if (editIndex !== null && textareaRef.current) {
            const textarea = textareaRef.current;
            textarea.focus();
            textarea.setSelectionRange(
                textarea.value.length,
                textarea.value.length
            );
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

    // ✅ Generate Document API call
    const handleGenerateDocument = async () => {
        try {
            const dynamicFileName = "businessidea.txt";
            const savedToken = Cookies.get("token");
            // const project_id = JSON.parse(
            //     localStorage.getItem("currentProject") || "{}"
            // ).project_id;
            const project_id = "30241e60-0554-4bd4-88f2-c2fcf6d339dd";

            // Combine Q&A into text
            const textContent = qaList
                .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
                .join("\n\n");

            // Convert to base64
            const base64Content = btoa(unescape(encodeURIComponent(textContent)));

            const payload = {
                fileName: dynamicFileName,
                fileContent: base64Content,
                token: savedToken,
                project_id: project_id,
                document_type: "gtm",
            };

            console.log("📤 Upload payload:", payload);

            await uploadTextFile(payload).unwrap();
            console.log("✅ File uploaded successfully");
        } catch (err) {
            console.error("❌ Upload failed", err);
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
                    {/* Question + Edit Icon */}
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
                            onClick={() =>
                                setEditIndex(editIndex === idx ? null : idx)
                            }
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

                    {/* Answer (editable or read-only) */}
                    <Box sx={{ mt: 1, minHeight: "40px" }}>
                        {editIndex === idx ? (
                            <>
                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: 3,
                                        "&::before": {
                                            content: '""',
                                            position: "absolute",
                                            inset: 0,
                                            padding: "2px",
                                            borderRadius: "inherit",
                                            background:
                                                "linear-gradient(270deg, #F34A84, #5D8AC6, #F34A84)",
                                            backgroundSize: "300% 300%",
                                            animation:
                                                "moveBorder 4s linear infinite",
                                            WebkitMask:
                                                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                            WebkitMaskComposite:
                                                "destination-out",
                                            maskComposite: "exclude",
                                            pointerEvents: "none",
                                        },
                                    }}
                                >
                                    {/* Inner box ensures text is above border mask */}
                                    <Box sx={{ position: "relative", zIndex: 1 }}>
                                        <TextareaAutosize
                                            ref={textareaRef}
                                            value={qa.answer}
                                            onChange={(e) =>
                                                handleAnswerChange(
                                                    idx,
                                                    e.target.value
                                                )
                                            }
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
                                    </Box>
                                </Box>

                                {/* ✅ Save + Cancel Buttons aligned right */}
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
                                        fontSize="0.9rem"
                                        height="40px"
                                    />
                                    <Button
                                        onClick={handleCancel}
                                        sx={{
                                            width: "120px",
                                            height: "40px",
                                            border: "1px solid #000",
                                            borderRadius: 3,
                                            fontWeight: 700,
                                            fontSize: "0.9rem",
                                            color: "#000",
                                            textTransform: "none",
                                            background: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            "&:hover": {
                                                background: "#f9f9f9",
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#555",
                                    fontSize: 14,
                                    fontWeight: 400,
                                }}
                            >
                                {qa.answer}
                            </Typography>
                        )}
                    </Box>
                </Card>
            ))}

            {/* 🔹 Generate Document button */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <GradientButton
                    text={isLoading ? "Uploading..." : "Generate Document"}
                    onClick={handleGenerateDocument}
                    disabled={isLoading}
                />
            </Box>

            {/* 🔹 Animated border keyframes */}
            <style>
                {`
          @keyframes moveBorder {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
            </style>
        </Card>
    );
};

export default FinalPreview;
