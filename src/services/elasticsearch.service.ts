import {Client, estypes} from "@elastic/elasticsearch";
import dotenv from "dotenv";

import {logger} from "../utils/logger";
import {HttpError} from "../utils";

dotenv.config();

export class ElasticsearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_HOST,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Ignore SSL certificate issues
      },
    });
  }

  async ping(): Promise<boolean> {
    try {
      await this.client.ping();
      logger.info("Connected to Elasticsearch");
      return true;
    } catch (error) {
      logger.error("Elasticsearch cluster is down!", error);
      return false;
    }
  }

  async search(query: estypes.SearchRequest) {
    try {
      const response = await this.client.search({
        index: process.env.ELASTICSEARCH_INDEX_NAME,
        ...query,
      });

      logger.info(`Search executed with ${(response.hits.total as estypes.SearchTotalHits).value} results`);
      return response;
    } catch (error) {
      logger.error("Error executing search", error);
      throw new HttpError(400, "Failed to execute search on elasticsearch: ", error);
    }
  }
}
