import {Router} from "express";

import {SearchController} from "../controllers";

export const searchRouter = (searchController: SearchController): Router => {
  const router = Router();

  router.get("/", (req, res, next) => searchController.search(req, res, next));

  return router;
};
