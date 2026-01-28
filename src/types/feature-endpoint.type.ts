import type { TResponse } from "./response.type";

export type TFeatureEndpointMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export type TFeatureEndpoint = {
  _id: string;
  feature: string;
  name: string;
  value: string;
  description?: string;
  endpoint: string;
  method: TFeatureEndpointMethod;
  min_credits: number;
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TFeatureEndpointResponse = TResponse<TFeatureEndpoint>;
export type TFeatureEndpointsResponse = TResponse<TFeatureEndpoint[]>;
