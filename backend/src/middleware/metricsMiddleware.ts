import { Request, Response, NextFunction } from "express";
import { httpRequestErrors, htttpRequestDuration } from "../utils/metrics";
export function merticsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const endTimer = htttpRequestDuration.startTimer();

  res.on("finish", () => {
    const route = req.route
      ? `${req.baseUrl}${req.route.path}`
      : req.originalUrl;

    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode),
    };
    endTimer(labels);
    if (res.statusCode >= 400) {
      httpRequestErrors.inc(labels);
    }
  });
  next();
}
