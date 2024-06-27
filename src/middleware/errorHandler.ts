import { NextFunction, Request, Response } from "express";
import { CustomError } from "./CustomError";

const errorDefinitions = require("./errorDefinitions.json"); // Adjust path as per your project structure

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  let statusCode = 500;
  let message = "Internal Server Error";
  let key = "INTERNAL_SERVER_ERROR";
  let errors: string | undefined = undefined;

  if (error instanceof CustomError && errorDefinitions[error.message]) {
    const errorDefinition = errorDefinitions[error.message];
    statusCode = errorDefinition.statusCode;
    message = errorDefinition.message;
    key = errorDefinition.key;
    errors = error.errors !== undefined ? error.errors : "";
  }

  const responseJson: any = { success: false, code: key, message };

  if (errors && errors.trim() !== "") {
    responseJson.errors = errors;
  }

  res.status(statusCode).json(responseJson);
};
