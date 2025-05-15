import { useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  useTheme,
  Skeleton,
} from "@mui/material";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEventStore } from "../store/eventStore";
import { useUIStore } from "../store/uiStore";
import Navbar from "../components/Navbar";
import { format } from "date-fns";
import { EventCard, EventCardSkeleton } from "../components/EventCard";
import React from "react";

// Define a type for event for better type safety
interface EventType {
  _id: string;
  name: string;
  description: string;
  date: string;
  category: string;
  price: number;
  venue: string;
  availableTickets: number;
  images?: string[];
}

const HomePage = () => {
  const { t } = useTranslation(["events", "common"]);
  const { theme: appTheme } = useUIStore();
  const {
    events,
    isLoading,
    fetchEvents,
    bookEvent,
    cancelBooking,
    bookedEvents,
    fetchUserBookings,
  } = useEventStore();
  const [bookingId, setBookingId] = React.useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchUserBookings();
  }, [fetchEvents, fetchUserBookings]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const handleBookEvent = async (eventId: string) => {
    try {
      setBookingId(eventId);
      await bookEvent(eventId);
      console.log("Booked event:", eventId);
    } catch (error) {
      console.error("Failed to book event:", error);
    } finally {
      setBookingId(null);
    }
  };

  const handleCancelBooking = async (eventId: string) => {
    try {
      setBookingId(eventId);
      await cancelBooking(eventId);
      console.log("Cancelled booking for event:", eventId);
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setBookingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",

        bgcolor: appTheme === "dark" ? "background.default" : "grey.100",
      }}
    >
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 10, pb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: "bold",
            color: "primary.main",
            textAlign: "center",
          }}
        >
          {t("events:upcomingEvents")}
        </Typography>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <EventCardSkeleton />
                </Grid>
              ))
            : events.map((event: EventType) => (
                <Grid item xs={12} sm={6} md={4} key={event._id}>
                  <EventCard
                    event={event}
                    onBook={handleBookEvent}
                    onCancel={handleCancelBooking}
                    bookingLoading={bookingId === event._id}
                    isBooked={bookedEvents.includes(event._id)}
                    t={t}
                  />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
