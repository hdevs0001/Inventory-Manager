import { httpRequestErrors, htttpRequestDuration } from "../utils/metrics.js";
export function merticsMiddleware(req, res, next) {
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
//# sourceMappingURL=metricsMiddleware.js.map