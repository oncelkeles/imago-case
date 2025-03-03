import {Request, Response, NextFunction} from "express";

import {ElasticsearchService} from "../../services/elasticsearch.service";
import {MediaService} from "../../services/media.service";
import {SearchService} from "../../services/search.service";
import {SearchController} from "../../controllers/search.controller";

describe("Search Flow Integration", () => {
  let esService: ElasticsearchService;
  let mediaService: MediaService;
  let searchService: SearchService;
  let searchController: SearchController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonSpy: jest.Mock;
  let mockNext: jest.Mock;

  beforeAll(async () => {
    // Set up real services with test config
    esService = new ElasticsearchService();
    const isConnected = await esService.ping();

    if (!isConnected) {
      throw new Error("Elasticsearch is not available for integration tests");
    }
  });

  beforeEach(() => {
    // Set up the full service chain
    mediaService = new MediaService();
    searchService = new SearchService(esService, mediaService);
    searchController = new SearchController(searchService);

    // Mock Express request/response objects
    jsonSpy = jest.fn();
    mockResponse = {
      json: jsonSpy,
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      query: {q: "test"},
    };

    mockNext = jest.fn();
  });

  it("should execute a full search flow from controller to ES and back", async () => {
    await searchController.search(mockRequest as Request, mockResponse as Response, mockNext as NextFunction);

    expect(jsonSpy).toHaveBeenCalled();
    const response = jsonSpy.mock.calls[0][0];

    expect(response.success).toBe(true);
    expect(response.results).toBeDefined();
    expect(Array.isArray(response.results)).toBe(true);

    // If results exist, validate the structure
    if (response.results.length > 0) {
      const firstItem = response.results[0];
      expect(firstItem.id).toBeDefined();
      expect(firstItem.url).toBeDefined();

      // Verify the thumbnail URL structure
      expect(firstItem.url).toMatch(/https:\/\/www\.imago-images\.de\/bild\/(st|sp)\/\d{10}\/s\.jpg/);
    }
  });
});
