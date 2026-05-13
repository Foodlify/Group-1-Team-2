import app from "./app";
import prisma from "./lib/prisma";
import "dotenv/config";
import { logger } from "./config/logger";

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Connected to DB (Prisma)");

    app.listen(3000, () => {
      logger.info("Server running", {
        port: 3000,
        env: process.env.NODE_ENV || "development",
      });
    });
  } catch (err) {
    logger.error("Failed to connect to DB", {
      error: (err as Error).message,
      stack: (err as Error).stack,
    });

    process.exit(1);
  }
}

startServer();
