import {Router} from "express";
import {searchRouter} from "./search.route";
import {healthRouter} from "./health.route";
import {SearchController} from "../controllers/search.controller";
import {ElasticsearchService} from "../services/elasticsearch.service";

const routes = (searchController: SearchController, esService: ElasticsearchService): Router => {
  const router = Router();

  router.use("/search", searchRouter(searchController));
  router.use("/health", healthRouter(esService));

  return router;
};

export default routes;
