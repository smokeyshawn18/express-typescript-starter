import app from "./app";
import { env } from "./config";
import { closeDatabase } from "./db/client";
import { logger } from "./utils/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`Server running on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  server.close(() => {
    void closeDatabase().finally(() => {
      logger.info("Shutdown complete");
      process.exit(0);
    });
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
