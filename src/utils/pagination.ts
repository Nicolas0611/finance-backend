export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export type PaginationParams = {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  meta: PaginationMeta;
};

export function toPaginationParams(
  page: number,
  pageSize: number,
): PaginationParams {
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function buildPaginationMeta(
  total: number,
  { page, pageSize }: Pick<PaginationParams, "page" | "pageSize">,
): PaginationMeta {
  return {
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
}

export async function paginate<T>(options: {
  findMany: () => Promise<T[]>;
  count: () => Promise<number>;
  pagination: PaginationParams;
}): Promise<PaginatedResult<T>> {
  const { findMany, count, pagination } = options;
  const [items, total] = await Promise.all([findMany(), count()]);

  return {
    items,
    meta: buildPaginationMeta(total, pagination),
  };
}
