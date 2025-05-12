import { Express, Router, Request, Response } from "express";

import { validationMiddleware } from "../../middlewares/validate";

const app: Router = Router();

import { UserModel, userSchema } from "../users/user.model";
import passport from "passport";
import { json } from "body-parser";
import { isAdminMiddleware } from "../../middlewares/IsAdmin";
import { CreateEventDto, UpdateEventDto } from "./events.dto";
import eventsModel from "./events.model";
import { NotFoundError } from "rest-api-errors";
import { updateEvent, getAllEvents, deleteEvent } from "./events.service";

// get all events
app.get("/", async (req: Request, res: Response) => {
  const {
    _start = "0",
    _end = "10",
    _sort = "date",
    _order = "ASC",
    ...filter
  } = req.query;

  const result = await getAllEvents({
    page: Math.floor(Number(_start) / Number(_end)) + 1,
    perPage: Number(_end) - Number(_start),
    sort: String(_sort),
    order: String(_order) as "ASC" | "DESC",
    filter,
  });

  // Transform _id to id for react-admin
  const transformedData = result.data.map((item) => ({
    ...item.toObject(),
    id: item._id,
  }));

  // Set X-Total-Count header for react-admin
  res.set("X-Total-Count", result.total.toString());

  res.status(200).json(transformedData);
});

export default app;
