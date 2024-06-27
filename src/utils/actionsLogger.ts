import winston from "winston";
import "winston-daily-rotate-file";
import dotenv from "dotenv";
import path from "path";

const envFilePath = path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envFilePath });

const transports: winston.transport[] = [];

// need to be tested again

transports.push(new winston.transports.Console());

// need to be tested again
// check if the logToFile enabled=> log to file
if (process.env.LOG_TO_FILE === "true") {
  transports.push(
    new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    })
  );
}

//the logger message

const actionsLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports,
});

export default actionsLogger;
