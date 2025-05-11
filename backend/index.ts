// src/index.ts
import express from "express";
import mongoose, { Mongoose, set } from "mongoose";

import {
  connectToMongo,
  mongo,
  MONGO_DATABASE,
  reconnectTimeout,
  SERVER_PORT,
  setupConnectHandlers,
} from "./config/db";
import "express-async-errors";
import authController from "./modules/auth/auth.controller";
import UsersController from "./modules/users/user.controller";
import EventsController from "./modules/events/events.controller";
import session from "express-session";
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

export const app = express(); // exporting it for testing purposes
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
  })
);
app.use(express.json());
app.use(cookieParser());

const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: String(process.env.SESSION_SECRET),
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: false,
    maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
  },
  store: MongoStore.create({
    mongoUrl: mongo.MONGO_CONNECTION,
    ttl: 60 * 60 * 24 * 7, // 7 days,
    autoRemove: "native",
  }),
});

app.use(sessionMiddleware);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

const router = express.Router();
router.use("/auth", authController);

// all routes after this middleware are protected by IsLoggedInMiddleware
router.use(isLoggedInMiddleware);

router.use("/users", UsersController);

router.use("/events", EventsController);

// make all endpoints start with the prefix api/v1
app.use("/api/v1", router);

app.use(errorHandlerMiddleware);

httpServer.listen(SERVER_PORT, async () => {
  console.log(`Server is running on http://localhost:${SERVER_PORT} `);

  try {
    setupConnectHandlers();
    await connectToMongo();
  } catch (err) {
    console.log(err);
  }
});
