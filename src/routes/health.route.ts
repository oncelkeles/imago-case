import {Router} from "express";
import {ElasticsearchService} from "../services/elasticsearch.service";

export const healthRouter = (esService: ElasticsearchService): Router => {
  const router = Router();

  router.get("/", async (req, res) => {
    const esStatus = await esService.ping();
    res.json({elasticsearch: esStatus ? "connected" : "disconnected"});
  });

  return router;
};
