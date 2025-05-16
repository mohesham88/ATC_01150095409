import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
  CircularProgress,
} from "@mui/material";
import { categoryChoices, EventTags } from "../admin/types/event";
import EventImagePreview from "./EventImagePreview";

interface EventEditDialogProps {
  open: boolean;
  onClose: () => void;
  event: any;
  onSave: (
    form: any,
    imageFiles: File[],
    removedImageIndexes: number[]
  ) => void;
  loading?: boolean;
}

const tagOptions = Object.values(EventTags);

const EventEditDialog: React.FC<EventEditDialogProps> = ({
  open,
  onClose,
  event,
  onSave,
  loading,
}) => {
  const [form, setForm] = useState<any>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [removedImageIndexes, setRemovedImageIndexes] = useState<number[]>([]);

  useEffect(() => {
    setForm(event || {});
    setImageFiles([]);
    setRemovedImageIndexes([]);
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name as string]: value });
  };

  const handleCategoryChange = (event: any) => {
    setForm({ ...form, category: event.target.value });
  };

  const handleTagsChange = (event: any) => {
    setForm({ ...form, tags: event.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveImage = (idx: number) => {
    setRemovedImageIndexes((prev) => [...prev, idx]);
  };

  const handleSave = () => {
    onSave(form, imageFiles, removedImageIndexes);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Description"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          margin="dense"
          label="Date"
          name="date"
          type="datetime-local"
          value={
            form.date ? new Date(form.date).toISOString().slice(0, 16) : ""
          }
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Venue"
          name="venue"
          value={form.venue || ""}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Price"
          name="price"
          type="number"
          value={form.price || 0}
          onChange={handleChange}
          fullWidth
        />
        {/* Category Select */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category"
            value={form.category || ""}
            label="Category"
            onChange={handleCategoryChange}
          >
            {categoryChoices.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Tags Multi-Select */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="tags-label">Tags</InputLabel>
          <Select
            labelId="tags-label"
            multiple
            name="tags"
            value={form.tags || []}
            onChange={handleTagsChange}
            renderValue={(selected) => (selected as string[]).join(", ")}
          >
            {tagOptions.map((tag) => (
              <MenuItem key={tag} value={tag}>
                <Checkbox checked={form.tags?.includes(tag) || false} />
                <ListItemText primary={tag} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box mt={2} mb={1}>
          <Typography variant="subtitle2">Current Images:</Typography>
          <Stack direction="row" spacing={1}>
            {event?.images?.map((img: any, idx: number) =>
              removedImageIndexes.includes(idx) ? null : (
                <EventImagePreview
                  key={idx}
                  src={`data:${img.mimetype};base64,${img.buffer}`}
                  alt="event"
                  onRemove={() => handleRemoveImage(idx)}
                  removable
                />
              )
            )}
          </Stack>
        </Box>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Upload Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        <Stack direction="row" spacing={1} mt={1}>
          {imageFiles.map((file, idx) => (
            <EventImagePreview
              key={idx}
              src={URL.createObjectURL(file)}
              alt="preview"
            />
          ))}
        </Stack>
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={2}
          >
            <CircularProgress size={32} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventEditDialog;
