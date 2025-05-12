import { Express, Router, Request, Response, NextFunction } from "express";
import { isAdminMiddleware } from "../../middlewares/IsAdmin";
import { Session } from "express-session";

import { validationMiddleware } from "../../middlewares/validate";
import { deleteEvent, updateEvent } from "../events/events.service";
import { CreateEventDto, UpdateEventDto } from "../events/events.dto";
import eventsModel from "../events/events.model";
import { loginAdmin } from "./admin.service";
import { SigninDto } from "../auth/auth.dto";
import passport from "passport";

const app: Router = Router();

// admin signin
app.post(
  "/auth/signin",
  validationMiddleware(SigninDto),
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (err: Error | null, user: any, info: { message: string }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        req.login(user, (err: Error | null) => {
          if (err) {
            return next(err);
          }
          req.user = user;
          return res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email.address,
            profile: user.profile,
          });
        });
      }
    )(req, res, next);
  }
);

// admin sign out
app.post("/auth/signout", isAdminMiddleware, (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      return res.status(500).json({ message: "Error signing out" });
    }
    res.clearCookie("admin.sid");
    res.status(200).json({ message: "Successfully signed out" });
  });
});

// app.use(isAdminMiddleware);

app.post(
  "/events/create",
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

app.patch(
  "/events/:id",
  isAdminMiddleware,
  validationMiddleware(UpdateEventDto),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const event = await updateEvent(id, updateData);
    res.status(200).json(event);
  }
);

app.delete(
  "/events/:id",
  isAdminMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const event = await deleteEvent(id);
    res.status(200).json(event);
  }
);

export default app;
