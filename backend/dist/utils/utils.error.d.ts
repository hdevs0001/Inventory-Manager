export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=utils.error.d.ts.map