// src/index.ts
import express from "express";
import mongoose, { Mongoose, set } from "mongoose";

import {
  connectToMongo,
  mongo,
  MONGO_DATABASE,
  reconnectTimeout,
  PORT,
  setupConnectHandlers,
} from "./config/db";
import "express-async-errors";
import authController from "./modules/auth/auth.controller";
import UsersController from "./modules/users/user.controller";
import EventsController from "./modules/events/events.controller";
import passport from "passport";
import "./modules/auth/strategies/local.strategy";
import "./modules/auth/strategies/google.strategy";
import { isLoggedInMiddleware } from "./middlewares/isLoggedIn";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";
import bodyParser from "body-parser";
import "cookie-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import MongoStore from "connect-mongo";
import { createServer } from "http";
import {
  userSessionMiddleware,
  adminSessionMiddleware,
} from "./config/sessions";
import adminController from "./modules/admin/admin.controller";
import { isAdminMiddleware } from "./middlewares/IsAdmin";
import BookingController from "./modules/bookings/booking.controller";

export const app = express(); // exporting it for testing purposes

app.use(
  cors({
    origin: (origin: string | undefined, callback: any) => {
      console.log("Origin: ", origin);
      if (!origin) return callback(null, true); // Allow Postman/Curl
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:4173", // local Vite
        "https://atc-01150095409.vercel.app", // main production site
        "http://localhost:5173", // local Vite
      ];

      // Allow Vercel domains for nows to get the preview site working
      const vercelRegex = /^https:\/\/[\w.-]+\.vercel\.app$/;

      if (allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
        console.log("CORS allowed for origin: ", origin);
        return callback(null, true);
      } else {
        console.log("CORS not allowed for origin: ", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
// Initialize passport
// app.use(passport.initialize());

const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());
router.use("/auth", authController);

// Admin routes with admin session
const adminRouter = express.Router();
adminRouter.use(passport.initialize());
adminRouter.use(passport.session());
adminRouter.use("/", adminController);
adminRouter.use("/", router);

router.use("/events", EventsController);
// all routes after this middleware are protected by IsLoggedInMiddleware
router.use(isLoggedInMiddleware);

router.use("/users", UsersController);

router.use("/bookings", BookingController);

// make all endpoints start with the prefix api/v1

app.use("/api/v1", userSessionMiddleware, router);
app.use("/api/v1/admin", adminSessionMiddleware, adminRouter);
app.use(errorHandlerMiddleware);

const httpServer = createServer(app);
httpServer.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT} `);

  try {
    setupConnectHandlers();
    await connectToMongo();
  } catch (err) {
    console.log(err);
  }
});
