import type { Response } from "./response.type";

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
  description?: string;
  endpoint: string;
  method: TFeatureEndpointMethod;
  token: number;
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TFeatureEndpointResponse = Response<TFeatureEndpoint>;
export type TFeatureEndpointsResponse = Response<TFeatureEndpoint[]>;
