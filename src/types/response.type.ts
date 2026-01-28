export type TMeta = {
  total?: number;
  page?: number;
  limit?: number;
  statistics?: Record<string, number>;
  [key: string]: unknown;
};

export type TResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  status?: number;
  data?: T;
  meta?: TMeta;
};

export type TErrorSource = {
  path: string;
  message: string;
};

export type TErrorResponse = {
  success: false;
  status: number;
  message: string;
  sources?: TErrorSource[];
  error?: {
    status: number;
    name: string;
  };
  stack?: string | null;
};
