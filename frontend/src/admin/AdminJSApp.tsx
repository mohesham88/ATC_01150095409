import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { adminAxiosInstance } from "../lib/axios";
import EventTable from "../components/EventTable";
import EventEditDialog from "../components/EventEditDialog";
import { useTranslation } from "react-i18next";
import { useEventStore } from "../store/eventStore";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  venue: string;
  price: number;
  category: string;
  tags: string[];
  images: { buffer: string; mimetype: string }[];
}

const AdminJSApp: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { createEvent, deleteEvent } = useEventStore();

  const { t } = useTranslation(["admin"]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data } = await adminAxiosInstance.get("/events");
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = async (id: string) => {
    setLoading(true);
    const { data } = await adminAxiosInstance.get(`/events?_id=${id}`);
    setSelectedEvent(data[0]);
    setEditOpen(true);
    setLoading(false);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setCreateOpen(true);
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete);
      setDeleteOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  const handleSave = async (
    form: any,
    imageFiles: File[],
    removedImageIndexes: number[]
  ) => {
    if (!selectedEvent) {
      // Create new event
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined) {
          if (key === "tags" && Array.isArray(value)) {
            value.forEach((tag) => formData.append("tags", tag));
          } else if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value.toString());
          }
        }
      });
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      await adminAxiosInstance.post("/events/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCreateOpen(false);
      setSaving(false);
      fetchEvents();
    } else {
      // Update existing event
      setSaving(true);
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined) {
          if (key === "tags" && Array.isArray(value)) {
            value.forEach((tag) => formData.append("tags", tag));
          } else if (typeof value === "string" || typeof value === "number") {
            formData.append(key, value.toString());
          }
        }
      });
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
      if (removedImageIndexes.length > 0) {
        formData.append(
          "removeImageIndexes",
          JSON.stringify(removedImageIndexes)
        );
      }
      await adminAxiosInstance.patch(`/events/${selectedEvent._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditOpen(false);
      setSaving(false);
      fetchEvents();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" fontWeight={700}>
          {t("admin:dashboard:title")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreate}
          sx={{ minWidth: 150 }}
        >
          {t("admin:events:create")}
        </Button>
      </Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="40vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <EventTable
          events={events}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <EventEditDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        event={selectedEvent}
        onSave={handleSave}
        loading={saving}
      />
      <EventEditDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        event={null}
        onSave={handleSave}
        loading={saving}
      />
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>{t("admin:events:confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>{t("admin:events:deleteConfirmation")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>
            {t("common:cancel")}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            {t("common:delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminJSApp;
