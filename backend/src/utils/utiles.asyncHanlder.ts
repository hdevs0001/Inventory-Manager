import { Request, Response, NextFunction, RequestHandler } from "express";
export function asyncHandler<P = {}>(
  fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler<P> {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
