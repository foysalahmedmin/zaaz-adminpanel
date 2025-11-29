import api from "@/lib/api";
import type { Response } from "@/types/response.type";
import type { TPlan } from "@/types/plan.type";

export type TPlanResponse = Response<TPlan>;
export type TPlansResponse = Response<TPlan[]>;

// GET Public Plans (No Auth Required)
export async function fetchPublicPlans(
  query?: Record<string, any>,
): Promise<TPlansResponse> {
  const response = await api.get("/api/plans/public", { params: query });
  return response.data as TPlansResponse;
}

export const fetchPlans = async (
  query?: Record<string, any>,
): Promise<TPlansResponse> => {
  const response = await api.get("/api/plans", { params: query });
  return response.data as TPlansResponse;
};

export const fetchPlan = async (id: string): Promise<TPlanResponse> => {
  const response = await api.get(`/api/plans/${id}`);
  return response.data as TPlanResponse;
};

export const createPlan = async (
  payload: Partial<TPlan>,
): Promise<TPlanResponse> => {
  const response = await api.post("/api/plans", payload);
  return response.data as TPlanResponse;
};

export const updatePlan = async (
  id: string,
  payload: Partial<TPlan>,
): Promise<TPlanResponse> => {
  const response = await api.patch(`/api/plans/${id}`, payload);
  return response.data as TPlanResponse;
};

export const deletePlan = async (id: string): Promise<TPlanResponse> => {
  const response = await api.delete(`/api/plans/${id}`);
  return response.data as TPlanResponse;
};

export const restorePlan = async (id: string): Promise<TPlanResponse> => {
  const response = await api.post(`/api/plans/${id}/restore`);
  return response.data as TPlanResponse;
};

