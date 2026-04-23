import api from "@/lib/api";
import type {
  TPackagePlan,
  TPackagePlanResponse,
  TPackagePlansResponse,
} from "@/types/package-plan.type";

export const fetchPackagePlans = async (
  query?: Record<string, unknown>,
): Promise<TPackagePlansResponse> => {
  const response = await api.get("/api/package-prices", { params: query });
  return response.data as TPackagePlansResponse;
};

export const fetchPackagePlan = async (
  id: string,
): Promise<TPackagePlanResponse> => {
  const response = await api.get(`/api/package-prices/${id}`);
  return response.data as TPackagePlanResponse;
};

export const createPackagePlan = async (
  payload: Partial<TPackagePlan>,
): Promise<TPackagePlanResponse> => {
  const response = await api.post("/api/package-prices", payload);
  return response.data as TPackagePlanResponse;
};

export const updatePackagePlan = async (
  id: string,
  payload: Partial<TPackagePlan>,
): Promise<TPackagePlanResponse> => {
  const response = await api.patch(`/api/package-prices/${id}`, payload);
  return response.data as TPackagePlanResponse;
};

export const deletePackagePlan = async (
  id: string,
): Promise<TPackagePlanResponse> => {
  const response = await api.delete(`/api/package-prices/${id}`);
  return response.data as TPackagePlanResponse;
};
