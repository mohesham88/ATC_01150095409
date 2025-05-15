import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EventImagePreviewProps {
  src: string;
  alt?: string;
  onRemove?: () => void;
  removable?: boolean;
}

const EventImagePreview: React.FC<EventImagePreviewProps> = ({
  src,
  alt,
  onRemove,
  removable = false,
}) => (
  <Box sx={{ position: "relative", display: "inline-block" }}>
    <img
      src={src}
      alt={alt || "event"}
      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }}
    />
    {removable && (
      <Tooltip title="Remove image">
        <IconButton
          size="small"
          onClick={onRemove}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bgcolor: "rgba(255,255,255,0.7)",
            p: 0.2,
            zIndex: 2,
            "&:hover": { bgcolor: "error.main", color: "white" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

export default EventImagePreview;
