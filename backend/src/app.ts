import express, { Application } from "express";
import { merticsMiddleware } from "./middleware/metricsMiddleware";
import healthRoutes from "./routes/health.routes";
import { register } from "./utils/metrics";
import { errorMiddleware } from "./middleware/error.middleware";
import productRoutes from "./routes/product.routes";
const app: Application = express();
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
