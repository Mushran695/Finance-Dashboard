import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import type { IncomingMessage, ServerResponse } from "node:http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// pino-http's typings may export a namespace object in some installs — coerce to callable factory
const createPinoHttp =
  (pinoHttp as unknown as (
    (opts?: { logger?: unknown; serializers?: unknown }) => any
  )) ?? (pinoHttp as any);

app.use(
  createPinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage & { id?: string; method?: string; url?: string }) {
        return {
          id: (req as any).id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
