import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const date = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  console.log(`[${date}] ${method} ${url}`);

  next();
};
