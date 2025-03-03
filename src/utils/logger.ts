import pino from "pino";

export const logger = pino({
  level: "info", // Set log level (info, error, debug, etc.)
  transport: {
    target: "pino-pretty", // Makes logs readable in development
    options: {
      colorize: true, // Colorize output
      translateTime: "HH:MM:ss Z", // Format timestamps
    },
  },
});
