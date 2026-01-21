export interface TFeatureUsageLog {
  [key: string]: unknown;
  _id: string;
  feature_endpoint:
    | {
        _id: string;
        name: string;
        method: string;
        endpoint: string;
        feature?: { _id: string; name: string; value: string };
      }
    | string;
  user?: { _id: string; name: string; email: string } | string;
  email?: string;
  usage_key?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  response?: Record<string, unknown>;
  status: "success" | "failed";
  code: number;
  type?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export type TFeatureUsageLogsResponse = {
  success: boolean;
  message: string;
  data: TFeatureUsageLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    statistics?: Record<string, number>;
  };
};

export type TFeatureUsageLogResponse = {
  success: boolean;
  message: string;
  data: TFeatureUsageLog;
};
