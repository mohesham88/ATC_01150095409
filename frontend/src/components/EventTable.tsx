import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EventImagePreview from "./EventImagePreview";

interface EventTableProps {
  events: any[];
  onEdit: (id: string) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, onEdit }) => (
  <TableContainer component={Paper} sx={{ mb: 4 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Venue</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Tags</TableCell>
          <TableCell>Images</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {events.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} align="center">
              <Typography variant="body1" color="text.secondary">
                No events found.
              </Typography>
            </TableCell>
          </TableRow>
        ) : (
          events.map((event) => (
            <TableRow key={event._id} hover>
              <TableCell>{event.name}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{event.venue}</TableCell>
              <TableCell>{event.category}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {event.tags?.map((tag: string) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  {event.images?.slice(0, 2).map((img: any, idx: number) => (
                    <EventImagePreview
                      key={idx}
                      src={`data:${img.mimetype};base64,${img.buffer}`}
                    />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(event._id)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default EventTable;
