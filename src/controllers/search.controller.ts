// src/controllers/search.controller.ts
import {NextFunction, Request, Response} from "express";

import {SearchService} from "../services/search.service";
import {logger} from "../utils/logger";
import {IBasePaginationResponse, TypedResponse} from "../interfaces";
import {SearchImageResponse} from "../types";

export class SearchController {
  constructor(private searchService: SearchService) {}

  async search(req: Request, res: TypedResponse<IBasePaginationResponse<SearchImageResponse>>, next: NextFunction) {
    try {
      const {q, page = "1", limit = "10", startDate, endDate} = req.query;

      const pageNum = parseInt(page as string, 10);
      const pageSize = parseInt(limit as string, 10);

      const results = await this.searchService.searchMedia({
        query: q as string,
        from: (pageNum - 1) * pageSize,
        size: pageSize,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.json({
        success: true,
        page: pageNum,
        pageSize,
        total: results.total,
        results: results.items,
      });
    } catch (error) {
      logger.error("Search controller error", error);
      next(error);
    }
  }
}
