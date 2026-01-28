import api from "@/lib/api";
import type { TResponse } from "@/types/response.type";
import type {
  TPackageFeatureConfig,
  TPackageFeatureConfigResponse,
  TPackageFeatureConfigsResponse,
} from "../types/package-feature-config.type";

export const getPackageFeatureConfigs = async (
  query?: Record<string, any>,
): Promise<TPackageFeatureConfigsResponse> => {
  const { data } = await api.get("/api/package-feature-configs", {
    params: query,
  });
  return data;
};

export const getPackageFeatureConfig = async (
  id: string,
): Promise<TPackageFeatureConfigResponse> => {
  const { data } = await api.get(`/api/package-feature-configs/${id}`);
  return data;
};

export const createPackageFeatureConfig = async (
  payload: Partial<TPackageFeatureConfig>,
): Promise<TPackageFeatureConfigResponse> => {
  const { data } = await api.post("/api/package-feature-configs", payload);
  return data;
};

export const updatePackageFeatureConfig = async (
  id: string,
  payload: Partial<TPackageFeatureConfig>,
): Promise<TPackageFeatureConfigResponse> => {
  const { data } = await api.patch(
    `/api/package-feature-configs/${id}`,
    payload,
  );
  return data;
};

export const bulkUpsertPackageConfigs = async (
  packageId: string,
  configs: any[],
): Promise<TResponse<null>> => {
  const { data } = await api.post(`/api/packages/${packageId}/configs/bulk`, {
    configs,
  });
  return data;
};

export const deletePackageFeatureConfig = async (
  id: string,
): Promise<TResponse<null>> => {
  const { data } = await api.delete(`/api/package-feature-configs/${id}`);
  return data;
};

export const deletePackageFeatureConfigPermanent = async (
  id: string,
): Promise<TResponse<null>> => {
  const { data } = await api.delete(
    `/api/package-feature-configs/${id}/permanent`,
  );
  return data;
};
