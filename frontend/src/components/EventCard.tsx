import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  Skeleton,
  useTheme,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";

export interface EventCardProps {
  event: {
    _id: string;
    name: string;
    description: string;
    date: string;
    category: string;
    price: number;
    venue: string;
    //availableTickets: number;
    images?: any[];
  };
  onBook: (eventId: string) => void;
  onCancel?: (eventId: string) => void;
  bookingLoading?: boolean;
  isBooked?: boolean;
  t: (key: string) => string;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onBook,
  onCancel,
  bookingLoading,
  isBooked,
  t,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log("event", event);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "350px",
        borderRadius: 3,
        boxShadow: 2,
        bgcolor: theme.palette.mode === "dark" ? "background.paper" : "#fff",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-6px) scale(1.01)",
          boxShadow: 6,
        },
      }}
      onClick={() => navigate(`/event/${event._id}`)}
    >
      <CardMedia
        component="img"
        height="180"
        image={
          event.images?.[0]?.buffer
            ? `data:${event.images?.[0]?.mimetype};base64,${event.images?.[0]?.buffer}`
            : "https://spotme.com/wp-content/uploads/2020/07/Hero-1.jpg"
        }
        alt={event.name}
        sx={{
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}
      >
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{ fontWeight: 700 }}
        >
          {event.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, minHeight: 40 }}
        >
          {event.description}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
          <Chip
            icon={<EventIcon />}
            label={formatDate(event.date)}
            size="small"
            color="primary"
          />
          <Chip
            icon={<CategoryIcon />}
            label={event.category}
            size="small"
            color="secondary"
          />
          <Chip
            icon={<AttachMoneyIcon />}
            label={`${event.price}`}
            size="small"
            color="success"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: "auto",
          }}
        >
          <Chip icon={<LocationOnIcon />} label={event.venue} size="small" />
          {/* <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {event.venue}
          </Typography> */}
        </Box>
        <Box>
          <Button
            variant="contained"
            color={isBooked ? "error" : "primary"}
            size="medium"
            fullWidth={true}
            onClick={(e) => {
              e.stopPropagation();
              if (isBooked && onCancel) {
                onCancel(event._id);
              } else if (!isBooked) {
                onBook(event._id);
              }
            }}
            disabled={bookingLoading}
            sx={{ textTransform: "none", borderRadius: 2, minWidth: 180 }}
          >
            {isBooked
              ? t("events:cancelBooking")
              : bookingLoading
              ? t("common:loading")
              : t("events:bookNow")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export const EventCardSkeleton: React.FC = () => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      boxShadow: 2,
    }}
  >
    <Skeleton
      variant="rectangular"
      height={180}
      animation="wave"
      sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
    />
    <CardContent>
      <Skeleton variant="text" height={32} width="80%" />
      <Skeleton variant="text" height={20} width="60%" />
      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        <Skeleton variant="rectangular" width={60} height={28} />
        <Skeleton variant="rectangular" width={60} height={28} />
        <Skeleton variant="rectangular" width={60} height={28} />
      </Box>
      <Skeleton variant="text" height={20} width="40%" sx={{ mt: 2 }} />
      <Skeleton variant="rectangular" height={36} width={90} sx={{ mt: 1 }} />
    </CardContent>
  </Card>
);
