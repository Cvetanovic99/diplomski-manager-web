export interface PaginationResponse<T>
{
  items:     T[];
  pageIndex: number;
  pageSize:  number;
  total:     number;
}
