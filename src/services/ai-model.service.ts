import api from "@/lib/api";
import type {
  TAiModel,
  TAiModelResponse,
  TAiModelsResponse,
} from "@/types/ai-model.type";

export async function fetchAiModels(
  query?: Record<string, unknown>,
): Promise<TAiModelsResponse> {
  const response = await api.get("/api/ai-models", { params: query });
  return response.data as TAiModelsResponse;
}

export async function fetchAiModel(id: string): Promise<TAiModelResponse> {
  const response = await api.get(`/api/ai-models/${id}`);
  return response.data as TAiModelResponse;
}

export async function createAiModel(
  payload: Partial<TAiModel>,
): Promise<TAiModelResponse> {
  const response = await api.post("/api/ai-models", payload);
  return response.data as TAiModelResponse;
}

export async function updateAiModel(
  id: string,
  payload: Partial<TAiModel>,
): Promise<TAiModelResponse> {
  const response = await api.patch(`/api/ai-models/${id}`, payload);
  return response.data as TAiModelResponse;
}

export async function deleteAiModel(id: string): Promise<TAiModelResponse> {
  const response = await api.delete(`/api/ai-models/${id}`);
  return response.data as TAiModelResponse;
}

export async function restoreAiModel(id: string): Promise<TAiModelResponse> {
  const response = await api.post(`/api/ai-models/${id}/restore`);
  return response.data as TAiModelResponse;
}

export async function deleteAiModelPermanent(
  id: string,
): Promise<TAiModelResponse> {
  const response = await api.delete(`/api/ai-models/${id}/permanent`);
  return response.data as TAiModelResponse;
}
