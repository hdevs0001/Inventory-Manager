import { Request, Response, NextFunction, RequestHandler } from "express";
export declare function asyncHandler<P = {}>(fn: (req: Request<P>, res: Response, next: NextFunction) => Promise<void>): RequestHandler<P>;
//# sourceMappingURL=utiles.asyncHanlder.d.ts.map