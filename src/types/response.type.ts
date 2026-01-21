export type TMeta = {
  total?: number;
  page?: number;
  limit?: number;
  statistics?: Record<string, number>;
  [key: string]: unknown;
};

export type Response<T = unknown> = {
  success?: boolean;
  message?: string;
  status?: number;
  data?: T;
  meta?: TMeta;
};

export type ErrorSource = {
  path: string;
  message: string;
};

export type ErrorResponse = {
  success: false;
  status: number;
  message: string;
  sources?: ErrorSource[];
  error?: {
    status: number;
    name: string;
  };
  stack?: string | null;
};
