import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === "development";

export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const PORT: number = process.env.PORT ? Number(process.env.PORT) : 12345;

export const server = {
  SERVER_HOSTNAME,
  PORT,
};

export const MONGO_USER = process.env.MONGO_USER || "";
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_APP_NAME = process.env.MONGO_APP_NAME || "";
export const MONGO_DATABASE = process.env.MONGO_DATABASE || "";

export const reconnectTimeout = 5000; // ms

export const MONGO_OPTIONS: mongoose.ConnectOptions = {
  retryWrites: true,
  writeConcern: {
    w: "majority",
  },
};

export const mongo = {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_APP_NAME,
  MONGO_DATABASE,
  MONGO_OPTIONS,
  MONGO_CONNECTION: `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_DATABASE}/?appName=${MONGO_APP_NAME}`,
};

export function setupConnectHandlers() {
  const db = mongoose.connection;
  db.on("connected", () => {
    console.info(`Connected to MongoDB`);
  });

  db.on("connecting", () => {
    console.info("----Connecting To MONGODB---");
  });

  db.on("error", (error) => {
    console.info(`MongoDB connection Error: ${error}`);
    mongoose.disconnect();
  });

  db.on("reconnected", () => {
    console.info(`MongoDB reconneted!`);
  });

  db.on("disconnected", () => {
    console.error(
      `MongoDB disconnected Reconnecting in ${reconnectTimeout / 1000}s`
    );
    setTimeout(async () => await connectToMongo(), reconnectTimeout);
  });
}

export async function connectToMongo() {
  try {
    const connection = await mongoose.connect(
      mongo.MONGO_CONNECTION,
      mongo.MONGO_OPTIONS
    );
  } catch (error) {
    console.error(`Failed to connect to MongoDB: ${error}`);
    console.info(`Retrying connection in ${reconnectTimeout / 1000}s...`);
    setTimeout(() => connectToMongo(), reconnectTimeout);
  }

  // logger.info('Connected to Database')
}
