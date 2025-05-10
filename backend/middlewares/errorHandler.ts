import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { APIError, NotFoundError } from "rest-api-errors";

export const errorHandlerMiddleware = (
  err: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  if(err.message){
    console.log(err.message);
    
  }

  res.status(err.status || 500).json({
    message: err.message || err.code,
  });
};
