import client from "prom-client";
export declare const register: client.Registry<"text/plain; version=0.0.4; charset=utf-8">;
export declare const htttpRequestDuration: client.Histogram<"method" | "route" | "status_code">;
export declare const httpRequestErrors: client.Counter<"method" | "route" | "status_code">;
//# sourceMappingURL=metrics.d.ts.map