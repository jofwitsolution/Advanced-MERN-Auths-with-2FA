import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import { config } from "../../config/app.config";
import * as fs from "fs";
import * as path from "path";

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Ensure the /tmp/logs directory exists
const logDir = "/tmp/logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create logger instance
export const logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      dirname: logDir,
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});
