import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import routes from "./routes";
import {errorHandler} from "./middlewares";
import {ElasticsearchService, MediaService, SearchService} from "./services";
import {SearchController} from "./controllers";

dotenv.config();

async function startServer() {
  try {
    console.log("Database initialized successfully");

    const app = express();
    const port = process.env.PORT || 3000;

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Initialize services
    const esService = new ElasticsearchService();
    const mediaService = new MediaService();
    const searchService = new SearchService(esService, mediaService);

    // Initialize controllers
    const searchController = new SearchController(searchService);

    // Setup routes
    app.use("/api", routes(searchController, esService));

    // Fallback for unhandled routes
    app.use((req, res) => {
      console.log(`[server]: Route not found: ${req.url}`);
      res.status(404).send("Route not found!");
    });

    // Error handling
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    process.on("SIGINT", async () => {
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      process.exit(0);
    });
  } catch (error) {
    console.log("[server]: Error starting server", error);
    process.exit(1);
  }
}

startServer();
