import express, { Application } from "express";
import cors from "cors";
import { merticsMiddleware } from "./middleware/metricsMiddleware.js";
import healthRoutes from "./routes/health.routes.js";
import { register } from "./utils/metrics.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import productRoutes from "./routes/product.routes.js";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:8080", // your Vite frontend's dev URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(merticsMiddleware);
app.use("/health", healthRoutes);
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.use("/api/product", productRoutes);
app.use(errorMiddleware);

export default app;