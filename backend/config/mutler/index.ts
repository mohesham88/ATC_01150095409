import multer from "multer";
import { cloundinaryStorage } from "../cloundinary";

const upload = multer({ storage: cloundinaryStorage });

export { upload as uploadToCloudinary };
