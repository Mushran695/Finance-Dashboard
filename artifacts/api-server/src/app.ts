import express, { type Express } from "express";
import cors from "cors";
import type { IncomingMessage, ServerResponse } from "node:http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Minimal app stub: removes pino-http dependency to avoid build-time typings issues
app.use("/api", router);

// Mount API routes if present
try {
  app.use("/api", router);
} catch (e) {
  // router may not exist in some trimmed setups; swallow to keep app buildable
}

export default app;
