import api from "@/lib/api";
import type {
  TBillingSetting,
  TBillingSettingResponse,
  TBillingSettingsResponse,
} from "@/types/billing-setting.type";

export async function fetchBillingSettings(
  query?: Record<string, unknown>,
): Promise<TBillingSettingsResponse> {
  const response = await api.get("/api/billing-settings", { params: query });
  return response.data as TBillingSettingsResponse;
}

export async function fetchBillingSetting(
  id: string,
): Promise<TBillingSettingResponse> {
  const response = await api.get(`/api/billing-settings/${id}`);
  return response.data as TBillingSettingResponse;
}

export async function createBillingSetting(
  payload: Partial<TBillingSetting>,
): Promise<TBillingSettingResponse> {
  const response = await api.post("/api/billing-settings", payload);
  return response.data as TBillingSettingResponse;
}

export async function updateBillingSetting(
  id: string,
  payload: Partial<TBillingSetting>,
): Promise<TBillingSettingResponse> {
  const response = await api.patch(`/api/billing-settings/${id}`, payload);
  return response.data as TBillingSettingResponse;
}

export async function deleteBillingSetting(
  id: string,
): Promise<TBillingSettingResponse> {
  const response = await api.delete(`/api/billing-settings/${id}`);
  return response.data as TBillingSettingResponse;
}

export async function restoreBillingSetting(
  id: string,
): Promise<TBillingSettingResponse> {
  const response = await api.post(`/api/billing-settings/${id}/restore`);
  return response.data as TBillingSettingResponse;
}

export async function deleteBillingSettingPermanent(
  id: string,
): Promise<TBillingSettingResponse> {
  const response = await api.delete(`/api/billing-settings/${id}/permanent`);
  return response.data as TBillingSettingResponse;
}
