import { TPackageFeatureConfig } from "../types/package-feature-config.type";
import { TResponse } from "../types/response.type";
import axiosInstance from "../utils/axiosInstance";

export const getPackageFeatureConfigs = async (
  query?: Record<string, any>,
): Promise<TResponse<TPackageFeatureConfig[]>> => {
  const { data } = await axiosInstance.get("/package-feature-configs", {
    params: query,
  });
  return data;
};

export const getPackageFeatureConfig = async (
  id: string,
): Promise<TResponse<TPackageFeatureConfig>> => {
  const { data } = await axiosInstance.get(`/package-feature-configs/${id}`);
  return data;
};

export const createPackageFeatureConfig = async (
  payload: Partial<TPackageFeatureConfig>,
): Promise<TResponse<TPackageFeatureConfig>> => {
  const { data } = await axiosInstance.post(
    "/package-feature-configs",
    payload,
  );
  return data;
};

export const updatePackageFeatureConfig = async (
  id: string,
  payload: Partial<TPackageFeatureConfig>,
): Promise<TResponse<TPackageFeatureConfig>> => {
  const { data } = await axiosInstance.patch(
    `/package-feature-configs/${id}`,
    payload,
  );
  return data;
};

export const bulkUpsertPackageConfigs = async (
  packageId: string,
  configs: any[],
): Promise<TResponse<null>> => {
  const { data } = await axiosInstance.post(
    `/packages/${packageId}/configs/bulk`,
    { configs },
  );
  return data;
};

export const deletePackageFeatureConfig = async (
  id: string,
): Promise<TResponse<null>> => {
  const { data } = await axiosInstance.delete(`/package-feature-configs/${id}`);
  return data;
};

export const deletePackageFeatureConfigPermanent = async (
  id: string,
): Promise<TResponse<null>> => {
  const { data } = await axiosInstance.delete(
    `/package-feature-configs/${id}/permanent`,
  );
  return data;
};
