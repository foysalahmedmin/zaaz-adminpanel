import api from "@/lib/api";
import type { TPlan } from "@/types/plan.type";
import type { TResponse } from "@/types/response.type";

export type TPlanResponse = TResponse<TPlan>;
export type TPlansResponse = TResponse<TPlan[]>;

// GET Public Plans (No Auth Required)
export async function fetchPublicPlans(
  query?: Record<string, unknown>,
): Promise<TPlansResponse> {
  const response = await api.get("/api/intervals/public", { params: query });
  return response.data as TPlansResponse;
}

export const fetchPlans = async (
  query?: Record<string, unknown>,
): Promise<TPlansResponse> => {
  const response = await api.get("/api/intervals", { params: query });
  return response.data as TPlansResponse;
};

export const fetchPlan = async (id: string): Promise<TPlanResponse> => {
  const response = await api.get(`/api/intervals/${id}`);
  return response.data as TPlanResponse;
};

export const createPlan = async (
  payload: Partial<TPlan>,
): Promise<TPlanResponse> => {
  const response = await api.post("/api/intervals", payload);
  return response.data as TPlanResponse;
};

export const updatePlan = async (
  id: string,
  payload: Partial<TPlan>,
): Promise<TPlanResponse> => {
  const response = await api.patch(`/api/intervals/${id}`, payload);
  return response.data as TPlanResponse;
};

export const deletePlan = async (id: string): Promise<TPlanResponse> => {
  const response = await api.delete(`/api/intervals/${id}`);
  return response.data as TPlanResponse;
};

export const restorePlan = async (id: string): Promise<TPlanResponse> => {
  const response = await api.post(`/api/intervals/${id}/restore`);
  return response.data as TPlanResponse;
};
