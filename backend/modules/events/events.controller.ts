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
import { updateEvent } from "./events.service";

// create event : admin only
app.post(
  "/create/",
  isAdminMiddleware,
  validationMiddleware(CreateEventDto),
  async (req: Request, res: Response) => {
    const { name, description, category, date, venue, price, image, tags } =
      req.body;
    const event = await eventsModel.create({
      name,
      description,
      category,
      date,
      venue,
      price,
      image,
      tags,
    });
    res.status(201).json(event);
  }
);

// update event : admin only
app.patch(
  "/:id",
  isAdminMiddleware,
  validationMiddleware(UpdateEventDto),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const event = await updateEvent(id, updateData);
    res.status(200).json(event);
  }
);

export default app;
