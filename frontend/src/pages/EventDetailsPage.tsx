import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  Container,
  Paper,
  Stack,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";
import ReactMarkdown from "react-markdown";
import { Navigation, Pagination } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useEventStore } from "../store/eventStore";

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  category: string;
  price: number;
  venue: string;
  tags: string[];
  images: { buffer: string; mimetype: string }[];
}

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation(["events", "common"]);
  const { bookEvent, cancelBooking, bookedEvents, fetchUserBookings } =
    useEventStore();
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/events?_id=${id}`);
        setEvent(data[0] || null);
      } catch (err) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    fetchUserBookings();
  }, [id, fetchUserBookings]);

  const handleBook = async () => {
    if (!event) return;
    setBookingLoading(true);
    try {
      await bookEvent(event._id);
    } catch (err) {
      // Error is handled by the store
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!event) return;
    setBookingLoading(true);
    try {
      await cancelBooking(event._id);
    } catch (err) {
      // Error is handled by the store
    } finally {
      setBookingLoading(false);
    }
  };

  const alreadyBooked = event && bookedEvents.includes(event._id);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minWidth="100vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        minWidth="100vw"
      >
        <Typography variant="h5">{t("events:eventNotFound")}</Typography>
        <Button onClick={() => navigate(-1)} sx={{ ml: 2 }}>
          {t("common:goBack")}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 12, pb: 4 }}>
        <Grid container spacing={4} direction={isSmall ? "column" : "row"}>
          <Grid component="div" item xs={12} md={4}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
              {/* Image Slider */}
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                style={{ width: "100%", height: 340 }}
              >
                {(event.images && event.images.length > 0
                  ? event.images
                  : [{ buffer: "", mimetype: "image/jpeg" }]
                ).map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Box
                      component="img"
                      src={
                        img.buffer
                          ? `data:${img.mimetype};base64,${img.buffer}`
                          : "https://source.unsplash.com/800x400/?event,concert"
                      }
                      alt={event.name}
                      sx={{ width: "100%", height: 340, objectFit: "cover" }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Box sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {event.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 2, flexWrap: "wrap" }}
                >
                  <Chip label={event.category} color="secondary" />
                  <Chip label={`$${event.price}`} color="success" />
                  <Chip
                    label={new Date(event.date).toLocaleDateString()}
                    color="primary"
                  />
                  <Chip label={event.venue} color="default" />
                  {event.tags?.map((tag) => (
                    <Chip key={tag} label={tag} color="info" />
                  ))}
                </Stack>
                <Button
                  variant="contained"
                  color={alreadyBooked ? "error" : "primary"}
                  size="large"
                  fullWidth
                  disabled={bookingLoading}
                  onClick={alreadyBooked ? handleCancel : handleBook}
                >
                  {alreadyBooked
                    ? t("events:cancelBooking")
                    : bookingLoading
                    ? t("common:loading")
                    : t("events:bookNow")}
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid component="div" item xs={12} md={8}>
            <Paper elevation={2} sx={{ borderRadius: 3, p: 3, minHeight: 340 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t("events:description")}
              </Typography>
              <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
                <ReactMarkdown>{event.description}</ReactMarkdown>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EventDetailsPage;
