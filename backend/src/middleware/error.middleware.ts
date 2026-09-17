import type { Request, Response } from "express";
export function errorMiddleware(error: Error, req: Request, res: Response) {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}
