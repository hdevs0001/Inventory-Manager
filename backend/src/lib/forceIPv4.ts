
import dns from "node:dns";

const originalLookup = dns.lookup;

// Node's Happy-Eyeballs connector (internalConnectMultiple) breaks when a
// hostname resolves to both IPv4 and IPv6 addresses but IPv6 has no route
// (common in Docker/WSL). See https://github.com/nodejs/undici/issues/2990 —
// IPv4 candidates end up ETIMEDOUT even though they work fine individually.
// Forcing family 4 here removes IPv6 from every lookup, process-wide, so
// fetch/WebSocket/net connections all fall back to normal IPv4 behavior.
// @ts-expect-error - overriding to force family 4 globally
dns.lookup = (hostname: string, options: any, callback: any) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  return originalLookup(hostname, { ...options, family: 4 }, callback);
};

console.log("DNS patch active: forcing IPv4-only resolution");