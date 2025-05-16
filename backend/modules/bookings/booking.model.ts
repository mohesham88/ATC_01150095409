import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    event: { type: Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["booked", "canceled"], default: "booked" },
  },
  { timestamps: true }
);

export default model("Booking", bookingSchema);
