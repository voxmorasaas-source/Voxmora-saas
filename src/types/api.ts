export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
      };
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
    };

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

