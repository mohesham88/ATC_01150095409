import { Express, Request, Response, NextFunction } from "express";
import { Unauthorized, UnauthorizedError } from "rest-api-errors";

export function isAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.user);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    throw new UnauthorizedError(
      "Access denied: This action requires administrator privileges"
    );
  }
}
