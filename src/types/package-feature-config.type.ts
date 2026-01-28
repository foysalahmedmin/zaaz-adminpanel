export type TPackageFeatureConfig = {
  _id: string;
  package: string | { _id: string; name: string };
  feature?: string | { _id: string; name: string; value: string } | null;
  feature_endpoint?:
    | string
    | { _id: string; name: string; value: string; endpoint: string }
    | null;
  config: {
    min_credits?: number;
    max_credits?: number;
    daily_limit?: number;
    monthly_limit?: number;
    enabled_options?: string[];
    disabled_options?: string[];
    max_tokens?: number;
    quality_tier?: "basic" | "standard" | "premium";
    priority?: number;
    custom?: Record<string, any>;
  };
  description?: string;
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};
