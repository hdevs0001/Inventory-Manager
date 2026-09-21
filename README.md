# Inventory Manager

A full-stack inventory management app: a Node.js/Express/TypeScript backend backed by **Prisma 7** and **Neon PostgreSQL** (serverless Postgres), a React/Vite frontend, and a monitoring stack (Prometheus + Grafana + node-exporter), all orchestrated with Docker Compose.

This README also documents a real, non-obvious set of networking bugs hit while deploying this project to a Linux (Ubuntu) Docker host, since the fixes aren't obvious and are easy to lose track of.

---

## Stack

**Backend**
- Node.js 22, Express 5, TypeScript
- Prisma ORM 7 (`prisma-client` generator, ESM)
- `@prisma/adapter-neon` — connects to Neon over WebSocket instead of raw Postgres TCP
- Prometheus metrics via `prom-client`

**Frontend**
- React 19 + Vite
- Tailwind CSS

**Infrastructure**
- Docker Compose (backend, frontend, Prometheus, Grafana, node-exporter)
- Neon PostgreSQL (external, serverless)

---
## APPLICATION SCREENSHOTS
**Inventory Dashboard**
![Inventory Dashboard](./docs/images/frontend.png)

**Add Product**
![Add Product](./docs/images/form.png)


**Update after the Add Product**
![Update](./docs/images/afterform.png)

**visual Design**
![Visual Design](./docs/images/design.png)
![Visual Design](./docs/images/table.png)

**VM Ubuntu Server(docker)**
![Ubuntu Server](./docs/images/linuxvm.png)

---

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── db/prisma.ts          # Prisma client, wired to the Neon adapter
│   │   ├── lib/forceIPv4.ts      # DNS patch — see "The IPv4/IPv6 bug" below
│   │   ├── app.ts                # Express app, CORS, routes, middleware
│   │   ├── server.ts             # Entry point
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── middleware/
│   ├── prisma/schema.prisma
│   └── Dockerfile
├── frontend/
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml
└── prometheus.yml
```

---

## Running it

### Backend

Create `backend/.env`:
```ini
DATABASE_URL="postgresql://user:pass@ep-xxxx-pooler.<region>.aws.neon.tech/db?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:pass@ep-xxxx.<region>.aws.neon.tech/db?sslmode=require"
CORS_ORIGINS=http://localhost:8080
```

- `DATABASE_URL` (pooled, hostname contains `-pooler`) is used by the running app.
- `DATABASE_URL_UNPOOLED` (direct, no `-pooler`) is used only by the Prisma CLI for migrations (`prisma migrate`, `prisma db push`).
- `CORS_ORIGINS` is a comma-separated list of allowed frontend origins (see [CORS](#cors) below).

### Frontend

Create `frontend/.env`:
```ini
VITE_API_URL=http://localhost:3001
```

Set this to wherever the backend is actually reachable from the browser — see the [`VITE_API_URL` note](#vite_api_url-is-baked-in-at-build-time) below, since this is a common source of confusing bugs when deploying to a remote host.

### Everything, via Docker

```bash
docker compose build --no-cache
docker compose up -d
```

- Backend: `http://<host>:3001`
- Frontend: `http://<host>:8080`
- Prometheus: `http://<host>:9090`
- Grafana: `http://<host>:3300`

---

## Notable bugs and why the fixes look the way they do

This project was originally developed and tested on Windows, then deployed to an Ubuntu VM (accessed over Tailscale) inside Docker. Several things that worked fine on Windows broke on Linux/Docker, for reasons that took real digging to pin down. Documenting them here so future-us doesn't re-debug the same things.

### `src/lib/forceIPv4.ts` — the IPv4/IPv6 bug

**Symptom:** Database queries failed intermittently or consistently with errors like `ETIMEDOUT`, `Received network error or non-101 status code`, or raw `fetch` throwing `TypeError: fetch failed` — but only inside Docker on the Ubuntu host, never on Windows, and never when connecting to a single, explicit IP address directly.

**Root cause:** The Neon database hostname resolves to both IPv4 (`A`) and IPv6 (`AAAA`) records. The Docker container has no usable IPv6 route at all — any IPv6 connection attempt fails immediately with `ENETUNREACH`. In principle this should be harmless: Node's connection logic ("Happy Eyeballs", RFC 8305) is supposed to just skip broken candidates and use whichever address works.

In practice, Node's core implementation of this logic (`internalConnectMultiple`, in `net.js`) has a real bug: when a hostname resolves to a **mix** of reachable IPv4 addresses and IPv6 addresses that fail instantly, the good IPv4 candidates can *also* end up timing out — not because they're unreachable, but because of how the algorithm mismanages the mixed attempt. This affects **any** connection made by hostname — raw `pg`/Postgres TCP connections, `fetch()`, and native `WebSocket`, since they all funnel through the same underlying Node core logic. This is a documented, known issue in the Node.js/undici ecosystem (see [nodejs/undici#2990](https://github.com/nodejs/undici/issues/2990) for the same failure signature in a similar Docker/WSL environment).

Confirming evidence:
- Every individual IPv4 address for the Neon hostname connected successfully on its own.
- The IPv6 addresses failed immediately with `ENETUNREACH` (no route) — expected, since the container has no IPv6 networking.
- Reordering DNS results (`--dns-result-order=ipv4first`) did **not** fix it, because that only changes the order Node tries candidates in — it doesn't remove IPv6 from the candidate list, so the same broken mixed-attempt logic still ran.

**The fix:** patch `dns.lookup` globally, at the very start of the process, to force `family: 4` on every lookup — removing IPv6 addresses from every DNS resolution in the app, for every hostname:

```ts
import dns from "node:dns";

const originalLookup = dns.lookup;

// @ts-expect-error - overriding to force family 4 globally
dns.lookup = (hostname, options, callback) => {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  return originalLookup(hostname, { ...options, family: 4 }, callback);
};
```

This is imported as the **very first line** of `src/server.ts`, before any other import — critical, because if Prisma/the DB adapter initializes before the patch is applied, its first connection attempts would still use the unpatched (broken) resolution.

**Why force IPv4 instead of something more surgical?** All of the Neon pooler's IPv4 addresses are independently reachable — the problem was never "which IP to use," it was that IPv6 candidates being present at all corrupts Node's own multi-address connection logic. Filtering out IPv6 lets Node's normal, otherwise-correct connection selection run cleanly across the (now IPv4-only) candidates — real redundancy across all IPv4 addresses is preserved; nothing is pinned to a single IP.

This almost certainly also explains earlier, separate-looking failures seen with a plain `pg`/`@prisma/adapter-pg` setup before switching to `@prisma/adapter-neon` — raw `pg` also connects by hostname and goes through this same Node core code path, just on port 5432 instead of 443.

---

### `VITE_API_URL` is baked in at build time

**Symptom:** The frontend kept trying to reach `http://localhost:3001` even after setting `VITE_API_URL` in `frontend/.env` and rebuilding — the compiled JS bundle's filename hash never changed across rebuilds, which was the giveaway that the new value was never actually reaching the build.

**Root cause, two layers:**

1. Vite environment variables like `VITE_API_URL` are resolved and baked directly into the built JS bundle **at build time** (`vite build`), not read at runtime. Setting them at container start does nothing.
2. The frontend's `Dockerfile` copies an explicit, hand-picked list of files into the build context and never included `.env`:
   ```dockerfile
   COPY package*.json ./
   COPY vite.config.ts ./
   COPY src ./src
   # ...
   RUN npm run build
   ```
   So even locally having `frontend/.env` set correctly, the value never entered the Docker build at all — `npm run build` ran inside the container with no `.env` present, and Vite silently fell back to its default of `http://localhost:3001`.

**The fix:** explicitly `COPY .env ./` into the builder stage before `RUN npm run build`.

**Why this matters more than it looks:** on `localhost`, backend and frontend share the same host, so `localhost:3001` "just works" by coincidence. The moment the frontend is accessed from a different machine (e.g. over Tailscale, from a teammate's laptop, from a real deployment), `localhost` in the browser refers to *that machine*, not the server — producing `ERR_CONNECTION_REFUSED` with no useful explanation unless you know to check what got baked into the bundle.

---

### CORS

**Symptom:** After fixing `VITE_API_URL`, requests from a non-`localhost` origin (e.g. `http://100.x.x.x:8080` over Tailscale) were blocked by the browser.

**Root cause:** the backend's CORS config only allowed a single, hardcoded origin:
```ts
app.use(cors({ origin: "http://localhost:8080", ... }));
```
Any other origin — including the exact same app served from a different IP/hostname — is a different origin as far as the browser's CORS policy is concerned, and gets blocked before the app code ever runs.

**The fix:** allow a configurable list of origins via an environment variable, rather than hardcoding one:
```ts
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:8080").split(",");

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  }),
);
```
Set in `backend/.env`:
```ini
CORS_ORIGINS=http://localhost:8080,http://100.95.40.50:8080
```
This is read at runtime (unlike the Vite variable above), so adding a new allowed origin is a `.env` edit and a container restart — no rebuild required.

---

## Lessons, if deploying this elsewhere

- If database connections work fine locally/on Windows but fail intermittently or with vague timeout errors inside Linux/Docker, suspect the IPv4/IPv6 Happy-Eyeballs interaction described above before assuming it's a credentials, firewall, or provider-side issue.
- Any `VITE_*`/build-time frontend env var must be present **in the Docker build context** and **at build time** — check the Dockerfile's `COPY` list, not just the `.env` file's existence.
- Whenever the app might be accessed from more than one origin (localhost, a VPN IP, a real domain), drive both `VITE_API_URL` and `CORS_ORIGINS` from environment/config rather than hardcoding a single value — the two need to agree with each other, and with however the app is actually being accessed.