export class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}
export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}
export class ValidationError extends AppError {
    constructor(message = "invalid input") {
        super(message, 400);
    }
}
//# sourceMappingURL=utils.error.js.map