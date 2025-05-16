import { Router, Request, Response } from "express";
import Booking from "./booking.model";
import { isLoggedInMiddleware } from "../../middlewares/isLoggedIn";
import { cancelBooking, createBooking } from "./booking.service";
import { User, UserModel } from "../users/user.model";
import { getAllEvents } from "../events/events.service";

const app = Router();

// Create a booking
app.post("/", async (req: Request, res: Response) => {
  const { eventId } = req.body;
  console.log("Event ID:", eventId);
  const user = req.user as UserModel;
  const booking = await createBooking(user._id as any, eventId);
  res.status(201).json(booking);
});

// List bookings (optionally filter by user/event)
app.get("/", async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.query.user) filter.user = req.query.user;
  if (req.query.event) filter.event = req.query.event;
  const bookings = await Booking.find(filter)
    .populate("user")
    .populate("event");
  res.status(200).json(bookings);
});

// Cancel a booking
app.delete("/:eventId", async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const booking = await cancelBooking(req.user?._id as any, eventId);
  res.status(200).json({ message: "Booking canceled successfully" });
});

app.get("/my-bookings", async (req: Request, res: Response) => {
  const user = req.user as UserModel;
  const bookings = await Booking.find({ user: user._id, status: "booked" });
  res.status(200).json(bookings);
});

export default app;
