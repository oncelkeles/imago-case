import {ErrorRequestHandler} from "express";
import {HttpError} from "../utils";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      ...(err.details ?? {details: err.details}),
    });
  } else {
    res.status(500).json({message: "Something went wrong!"});
  }
};
