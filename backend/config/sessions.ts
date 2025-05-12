import session from "express-session";
import MongoStore from "connect-mongo";
import { mongo } from "./db";


export const userSessionMiddleware = session({
  name: "user.sid",
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
    ttl: 60 * 60 * 24 * 7, // 7 days
    autoRemove: "native",
    collectionName: "user_sessions",
  }),
});

export const adminSessionMiddleware = session({
  name: "admin.sid",
  resave: false,
  saveUninitialized: false,
  secret: String(
    process.env.ADMIN_SESSION_SECRET || process.env.SESSION_SECRET
  ),
  cookie: {
    secure: process.env.NODE_ENV === "production" ? true : false,
    httpOnly: false,
    maxAge: 24 * 7 * 60 * 60 * 1000, // 7 days
  },
  store: MongoStore.create({
    mongoUrl: mongo.MONGO_CONNECTION,
    ttl: 60 * 60 * 24 * 2, // 2 days
    autoRemove: "native",
    collectionName: "admin_sessions",
  }),
});
