// Require the cloudinary library
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Return "https" URLs by setting secure: true
cloudinary.config({
  // secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MEvent",
    allowed_formats: ["jpg", "jpeg", "png"], // Optional: Restrict allowed file types
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

export { storage as cloundinaryStorage };
