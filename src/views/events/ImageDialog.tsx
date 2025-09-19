"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ImageDialogProps {
  open: boolean;
  onClose: () => void;
  data?: {
    image_keys: string[];
    message?: string;
    scheduled_time?: string;
  } | null;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ open, onClose, data }) => {
  // ✅ Hooks always declared at top-level
  const [message, setMessage] = useState(data?.message || "");
  const [scheduledTime, setScheduledTime] = useState("");
  const [images, setImages] = useState<string[]>(data?.image_keys || []);

  // ✅ Update state when props change
  useEffect(() => {
    if (data) {
      setMessage(data.message || "");
      setImages(data.image_keys || []);

      if (data.scheduled_time) {
        const dt = new Date(data.scheduled_time);
        const tzOffset = dt.getTimezoneOffset() * 60000;
        const localISOTime = new Date(dt.getTime() - tzOffset)
          .toISOString()
          .slice(0, 16);
        setScheduledTime(localISOTime);
      } else {
        setScheduledTime("");
      }
    }
  }, [data, open]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        if (typeof base64 === "string") {
          setImages((prev) => [...prev, base64]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditClick = () => {
    const isoScheduledTime = scheduledTime
      ? new Date(scheduledTime).toISOString()
      : "";

    const updatedData = {
      message,
      scheduled_time: isoScheduledTime,
      image_keys: images,
    };

    console.log("Edited data:", updatedData);
    // TODO: Replace console.log with your API call or state update logic
    onClose();
  };

  const handleDeleteClick = () => {
    console.log("Post deleted");
    // TODO: Replace console.log with your delete API call or state update logic
    setMessage("");
    setScheduledTime("");
    setImages([]);
    onClose();
  };

  // ✅ Safe early return after hooks
  if (!data) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Linkedin Post</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: "70vh", overflowY: "auto" }}>
        <Box mb={2}>
          <TextField
            label="Message"
            multiline
            fullWidth
            minRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Box>

        <Box mb={2}>
          <TextField
            label="Scheduled Time"
            type="datetime-local"
            fullWidth
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>

        <Box mb={2}>
          <Button variant="contained" component="label">
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageUpload}
            />
          </Button>
        </Box>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          maxHeight="300px"
          overflow="auto"
          mb={2}
        >
          {images.length > 0 ? (
            images.map((imgSrc, index) => (
              <Box
                key={index}
                position="relative"
                width={120}
                height={120}
                borderRadius={1}
                boxShadow="0 2px 8px rgba(0,0,0,0.2)"
                overflow="hidden"
              >
                <img
                  src={
                    imgSrc.startsWith("data:")
                      ? imgSrc
                      : `data:image/png;base64,${imgSrc}`
                  }
                  alt={`uploaded-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "rgba(255,255,255,0.7)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                  }}
                  aria-label="Remove image"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">No images uploaded.</Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleEditClick} color="primary" variant="contained">
          Edit
        </Button>
        <Button onClick={handleDeleteClick} color="error" variant="outlined">
          Delete
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
