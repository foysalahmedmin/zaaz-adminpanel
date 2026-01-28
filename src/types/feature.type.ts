import type { Response } from "./response.type";

export type TFeatureType = "writing" | "generation" | "other";

export type TFeature = {
  _id: string;
  parent?: string | null;
  name: string;
  value: string;
  description?: string;
  path?: string;
  prefix?: string;
  type?: TFeatureType;
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TFeatureResponse = Response<TFeature>;
export type TFeaturesResponse = Response<TFeature[]>;
