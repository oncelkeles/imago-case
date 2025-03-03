export interface IBasePaginationResponse<T> {
  success: boolean;
  page: number;
  pageSize: number;
  total: number;
  results: T[];
}
