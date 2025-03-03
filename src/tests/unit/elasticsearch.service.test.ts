import {estypes} from "@elastic/elasticsearch";

import {ElasticsearchService} from "../../services";
import {EsImage} from "../../types";

// Mock the Elasticsearch client
jest.mock("@elastic/elasticsearch", () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      ping: jest.fn().mockResolvedValue(true),
      search: jest.fn().mockResolvedValue({
        hits: {
          total: {value: 2},
          hits: [
            {
              _id: "12345",
              _index: "imago",
              _score: 1,
              _source: {
                bildnummer: "12345678",
                datum: "2024-02-17T00:00:00.000Z",
                suchtext: "Lorem ipsum",
                hoehe: "4000",
                breite: "6000",
                db: "st",
              },
            },
            {
              _id: "67890",
              _index: "imago",
              _score: 1,
              _source: {
                bildnummer: "1234567",
                datum: "2022-03-17T00:00:00.000Z",
                suchtext: "Lorem ipsum lorem",
                hoehe: "4000",
                breite: "6000",
                db: "sp",
              },
            },
          ],
        },
      }),
    })),
  };
});

describe("ElasticsearchService", () => {
  let service: ElasticsearchService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ElasticsearchService();
  });

  describe("search", () => {
    it("should return search results", async () => {
      const query = {
        body: {query: {match_all: {}}},
      };

      const result = await service.search({
        from: 1,
        size: 10,
        query: {
          bool: {
            must: [{match_all: {}}],
          },
        },
      });

      expect((result.hits.total as estypes.SearchTotalHits).value).toBe(2);
      expect(result.hits.hits).toHaveLength(2);
      expect((result.hits.hits[0] as EsImage)._source.suchtext).toBe("Lorem ipsum");
    });
  });
});
