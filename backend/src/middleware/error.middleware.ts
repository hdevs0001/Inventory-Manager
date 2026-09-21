 import type { Request, Response, NextFunction } from "express";

// export function errorMiddleware(
//   error: Error,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   console.error(error);

//   res.status(500).json({
//     success: false,
//     message: error.message || "Internal Server Error",
//   });
// }
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("===== ERROR =====");
  console.error("Message:", error.message);
  console.error("Name:", error.name);
  console.error("Stack:", error.stack);
  console.error("Full error:", error);
  console.error("=================");

  res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
}