import client from "prom-client";
export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const htttpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration o Http requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});
register.registerMetric(htttpRequestDuration);

export const httpRequestErrors = new client.Counter({
  name: "http_requests_errors_total",
  help: "Total count of HTTP requests that resulted in a error status code",
  labelNames: ["method", "route", "status_code"],
});

register.registerMetric(httpRequestErrors);
