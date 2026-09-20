export function errorMiddleware(error, req, res, next) {
    console.error(error);
    res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
}
//# sourceMappingURL=error.middleware.js.map