import api from "@/lib/api";
import type {
  TPackagePlan,
  TPackagePlanResponse,
  TPackagePlansResponse,
} from "@/types/package-plan.type";

export const fetchPackagePlans = async (
  query?: Record<string, any>,
): Promise<TPackagePlansResponse> => {
  const response = await api.get("/api/package-plans", { params: query });
  return response.data as TPackagePlansResponse;
};

export const fetchPackagePlan = async (
  id: string,
): Promise<TPackagePlanResponse> => {
  const response = await api.get(`/api/package-plans/${id}`);
  return response.data as TPackagePlanResponse;
};

export const createPackagePlan = async (
  payload: Partial<TPackagePlan>,
): Promise<TPackagePlanResponse> => {
  const response = await api.post("/api/package-plans", payload);
  return response.data as TPackagePlanResponse;
};

export const updatePackagePlan = async (
  id: string,
  payload: Partial<TPackagePlan>,
): Promise<TPackagePlanResponse> => {
  const response = await api.patch(`/api/package-plans/${id}`, payload);
  return response.data as TPackagePlanResponse;
};

export const deletePackagePlan = async (
  id: string,
): Promise<TPackagePlanResponse> => {
  const response = await api.delete(`/api/package-plans/${id}`);
  return response.data as TPackagePlanResponse;
};

