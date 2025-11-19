import api from "@/lib/api";
import type {
  TFeatureEndpoint,
  TFeatureEndpointResponse,
  TFeatureEndpointsResponse,
} from "@/types/feature-endpoint.type";

// GET All Feature Endpoints (Admin)
export async function fetchFeatureEndpoints(
  query?: Record<string, any>,
): Promise<TFeatureEndpointsResponse> {
  const response = await api.get("/api/feature-endpoints", { params: query });
  return response.data as TFeatureEndpointsResponse;
}

// GET Single Feature Endpoint by ID (Admin)
export async function fetchFeatureEndpoint(
  id: string,
): Promise<TFeatureEndpointResponse> {
  const response = await api.get(`/api/feature-endpoints/${id}`);
  return response.data as TFeatureEndpointResponse;
}

// POST Create Feature Endpoint (Admin)
export async function createFeatureEndpoint(
  payload: Partial<TFeatureEndpoint>,
): Promise<TFeatureEndpointResponse> {
  const response = await api.post("/api/feature-endpoints", payload);
  return response.data as TFeatureEndpointResponse;
}

// PATCH Update Feature Endpoint (Admin)
export async function updateFeatureEndpoint(
  id: string,
  payload: Partial<TFeatureEndpoint>,
): Promise<TFeatureEndpointResponse> {
  const response = await api.patch(`/api/feature-endpoints/${id}`, payload);
  return response.data as TFeatureEndpointResponse;
}

// PATCH Bulk Update Feature Endpoints (Admin)
export async function updateFeatureEndpoints(payload: {
  ids: string[];
  is_active?: boolean;
}): Promise<TFeatureEndpointsResponse> {
  const response = await api.patch("/api/feature-endpoints/bulk", payload);
  return response.data as TFeatureEndpointsResponse;
}

// DELETE Single Feature Endpoint (Admin)
export async function deleteFeatureEndpoint(
  id: string,
): Promise<TFeatureEndpointResponse> {
  const response = await api.delete(`/api/feature-endpoints/${id}`);
  return response.data as TFeatureEndpointResponse;
}

// DELETE Bulk Feature Endpoints (Admin)
export async function deleteFeatureEndpoints(payload: {
  ids: string[];
}): Promise<TFeatureEndpointsResponse> {
  const response = await api.delete("/api/feature-endpoints/bulk", {
    data: payload,
  });
  return response.data as TFeatureEndpointsResponse;
}

// DELETE Single Permanent (Admin)
export async function deleteFeatureEndpointPermanent(
  id: string,
): Promise<TFeatureEndpointResponse> {
  const response = await api.delete(`/api/feature-endpoints/${id}/permanent`);
  return response.data as TFeatureEndpointResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deleteFeatureEndpointsPermanent(payload: {
  ids: string[];
}): Promise<TFeatureEndpointsResponse> {
  const response = await api.delete("/api/feature-endpoints/bulk/permanent", {
    data: payload,
  });
  return response.data as TFeatureEndpointsResponse;
}

// POST Single Restore (Admin)
export async function restoreFeatureEndpoint(
  id: string,
): Promise<TFeatureEndpointResponse> {
  const response = await api.post(`/api/feature-endpoints/${id}/restore`);
  return response.data as TFeatureEndpointResponse;
}

// POST Bulk Restore (Admin)
export async function restoreFeatureEndpoints(payload: {
  ids: string[];
}): Promise<TFeatureEndpointsResponse> {
  const response = await api.post("/api/feature-endpoints/bulk/restore", payload);
  return response.data as TFeatureEndpointsResponse;
}

