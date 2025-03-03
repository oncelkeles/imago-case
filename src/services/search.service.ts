import {ElasticsearchService} from "./elasticsearch.service";
import {MediaService} from "./media.service";
import {logger} from "../utils/logger";
import {HttpError, normalizeDate, normalizeSearchQuery} from "../utils";
import {EsImage} from "../types";
import {estypes} from "@elastic/elasticsearch";
import {ISearchParams} from "../interfaces";

export class SearchService {
  constructor(private esService: ElasticsearchService, private mediaService: MediaService) {}

  async searchMedia(params: ISearchParams = {}) {
    const {query = "", fields = ["suchtext"], from = 0, size = 10, startDate, endDate} = params;

    try {
      // Build the search query
      const searchQuery = this.buildSearchQuery(query, fields, startDate, endDate);

      // Execute search
      const searchResult = await this.esService.search({
        from,
        size,
        query: searchQuery,
        sort: [
          {_score: {order: "desc"}},
          {bildnummer: "asc"}, // Stable secondary sort field
        ],
      });

      // Transform the results
      return this.transformSearchResults(searchResult);
    } catch (error) {
      logger.error("Error searching media", error);
      throw new HttpError(400, "Failed to execute search: ", error);
    }
  }

  private buildSearchQuery(
    query: string,
    fields: string[],
    startDate: string,
    endDate: string,
  ): estypes.QueryDslQueryContainer {
    const must = [];
    const filter = [];

    // Add text search if query provided
    if (query) {
      must.push({
        multi_match: {
          query: normalizeSearchQuery(query),
          fields,
          type: "most_fields",
          fuzziness: "AUTO",
        },
      });
    }

    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);
    if (normalizedStartDate || normalizedEndDate) {
      filter.push({
        range: {
          datum: {
            ...(normalizedStartDate ? {gte: normalizedStartDate} : {}),
            ...(normalizedEndDate ? {lte: normalizedEndDate} : {}),
            format: "strict_date_optional_time",
          },
        },
      });
    }

    return {
      bool: {
        must: must.length ? must : [{match_all: {}}],
        filter,
      },
    };
  }

  /**
   * Transform Elasticsearch results to normalized media items
   */
  private transformSearchResults(searchResult: estypes.SearchResponse) {
    const {hits} = searchResult.hits;
    const total = (searchResult.hits.total as estypes.SearchTotalHits).value;

    const items = hits.map((hit: EsImage) => {
      return this.mediaService.normalizeMedia(hit._source);
    });

    return {
      total,
      items,
    };
  }
}
