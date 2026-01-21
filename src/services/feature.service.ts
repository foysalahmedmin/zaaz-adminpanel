import api from "@/lib/api";
import type {
  TFeature,
  TFeatureResponse,
  TFeaturesResponse,
} from "@/types/feature.type";

// GET All Features (Admin)
export async function fetchFeatures(
  query?: Record<string, unknown>,
): Promise<TFeaturesResponse> {
  const response = await api.get("/api/features", { params: query });
  return response.data as TFeaturesResponse;
}

// GET Single Feature by ID (Admin)
export async function fetchFeature(id: string): Promise<TFeatureResponse> {
  const response = await api.get(`/api/features/${id}`);
  return response.data as TFeatureResponse;
}

// POST Create Feature (Admin)
export async function createFeature(
  payload: Partial<TFeature>,
): Promise<TFeatureResponse> {
  const response = await api.post("/api/features", payload);
  return response.data as TFeatureResponse;
}

// PATCH Update Feature (Admin)
export async function updateFeature(
  id: string,
  payload: Partial<TFeature>,
): Promise<TFeatureResponse> {
  const response = await api.patch(`/api/features/${id}`, payload);
  return response.data as TFeatureResponse;
}

// PATCH Bulk Update Features (Admin)
export async function updateFeatures(payload: {
  ids: string[];
  is_active?: boolean;
}): Promise<TFeaturesResponse> {
  const response = await api.patch("/api/features/bulk", payload);
  return response.data as TFeaturesResponse;
}

// DELETE Single Feature (Admin)
export async function deleteFeature(id: string): Promise<TFeatureResponse> {
  const response = await api.delete(`/api/features/${id}`);
  return response.data as TFeatureResponse;
}

// DELETE Bulk Features (Admin)
export async function deleteFeatures(payload: {
  ids: string[];
}): Promise<TFeaturesResponse> {
  const response = await api.delete("/api/features/bulk", { data: payload });
  return response.data as TFeaturesResponse;
}

// DELETE Single Permanent (Admin)
export async function deleteFeaturePermanent(
  id: string,
): Promise<TFeatureResponse> {
  const response = await api.delete(`/api/features/${id}/permanent`);
  return response.data as TFeatureResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deleteFeaturesPermanent(payload: {
  ids: string[];
}): Promise<TFeaturesResponse> {
  const response = await api.delete("/api/features/bulk/permanent", {
    data: payload,
  });
  return response.data as TFeaturesResponse;
}

// POST Single Restore (Admin)
export async function restoreFeature(id: string): Promise<TFeatureResponse> {
  const response = await api.post(`/api/features/${id}/restore`);
  return response.data as TFeatureResponse;
}

// POST Bulk Restore (Admin)
export async function restoreFeatures(payload: {
  ids: string[];
}): Promise<TFeaturesResponse> {
  const response = await api.post("/api/features/bulk/restore", payload);
  return response.data as TFeaturesResponse;
}

