import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EventImagePreviewProps {
  src: string;
  alt: string;
  onRemove?: (index: number) => void;
  index: number;
  mimetype?: string;
}

const EventImagePreview: React.FC<EventImagePreviewProps> = ({ src, alt, onRemove, index }) => (
  <Box sx={{ position: "relative", display: "inline-block", m: 0.5 }}>
    <img
      src={src}
      alt={alt}
      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, boxShadow: 1 }}
    />
    {onRemove && (
      <Tooltip title="Remove image">
        <IconButton
          size="small"
          onClick={() => onRemove(index)}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bgcolor: "rgba(255,255,255,0.7)",
            p: 0.2,
            zIndex: 2,
            '&:hover': { bgcolor: 'error.main', color: 'white' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

export default EventImagePreview; 