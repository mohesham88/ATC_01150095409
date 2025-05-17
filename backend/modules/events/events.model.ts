// models/Event.ts
import { Schema, model } from "mongoose";

export enum EventTags {
  FreeEntry = "Free Entry",
  OnlineEvent = "Online Event",
  InPerson = "In-Person",
  Coding = "Coding",
  Gaming = "Gaming",
  Music = "Music",
  Art = "Art",
  Food = "Food",
  Fashion = "Fashion",
  Sports = "Sports",
  Technology = "Technology",
  Science = "Science",
  Health = "Health",
  Wellness = "Wellness",
  Travel = "Travel",
  Education = "Education",
  Business = "Business",
  Entertainment = "Entertainment",
  CareerGrowth = "Career Growth",
  Other = "Other",
}

// Store the images in mongo for now will change to media storage later if the time allows
// const imageSchema = new Schema({
//   buffer: { type: Buffer, required: true },
//   originalname: { type: String },
//   "Content-Type": { type: String },
//   fieldname: { type: String },
//   encoding: { type: String },
//   mimetype: { type: String },

//   // contentType: { type: String, required: true }, // e.g., "image/jpeg"
// });

// TODO: Add google maps location to the event
const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    date: { type: Date, required: true },
    venue: { type: String },
    price: { type: Number, required: true },
    images: {
      type: [String],
      required: false,
      validate: [arrayLimit, "You can only upload up to 5 images per event"],
    },
    tags: [
      {
        type: String,
        enum: EventTags,
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val: unknown[]) {
  return val.length <= 5;
}

export default model("Event", eventSchema);
