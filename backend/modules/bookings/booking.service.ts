import { BadRequestError, NotFoundError } from "rest-api-errors";
import Booking from "./booking.model";
import { getAllEvents } from "../events/events.service";

export const createBooking = async (userId: string, eventId: string) => {
  const event = await getAllEvents({
    filter: { _id: eventId },
  });

  console.log(event);

  if (!event) {
    throw new NotFoundError("Event not found");
  }
  const bookingExists = await checkBookingExists(userId, eventId);

  if (bookingExists && bookingExists.status !== "canceled") {
    // If the booking exists and is not canceled, throw an error
    throw new BadRequestError("Booking already exists");
  }
  if (bookingExists && bookingExists?.status === "canceled") {
    // If the booking exists and is canceled, update the status to "active"
    bookingExists.status = "booked";
    await bookingExists.save();
    return bookingExists;
  }

  const booking = await Booking.create({ user: userId, event: eventId });
  return booking;
};

export const getBookingById = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) {
    return null;
  }
  return booking;
};

export const checkBookingExists = async (userId: string, eventId: string) => {
  const booking = await Booking.findOne({ user: userId, event: eventId });
  if (!booking) {
    return null;
  }
  return booking;
};

export const cancelBooking = async (userId: any, eventId: string) => {
  const booking = await checkBookingExists(userId, eventId);
  if (!booking) {
    throw new NotFoundError("Booking not found");
  }
  if (booking.status === "canceled") {
    throw new BadRequestError("Booking already canceled");
  }
  booking.status = "canceled";
  await booking.save();
};
