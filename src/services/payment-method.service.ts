import api from "@/lib/api";
import type {
  TPaymentMethod,
  TPaymentMethodResponse,
  TPaymentMethodsResponse,
} from "@/types/payment-method.type";

// GET Public Payment Methods (No Auth Required)
export async function fetchPublicPaymentMethods(
  query?: Record<string, unknown>,
): Promise<TPaymentMethodsResponse> {
  const response = await api.get("/api/payment-methods/public", {
    params: query,
  });
  return response.data as TPaymentMethodsResponse;
}

// GET Single Public Payment Method by ID (No Auth Required)
export async function fetchPublicPaymentMethod(
  id: string,
): Promise<TPaymentMethodResponse> {
  const response = await api.get(`/api/payment-methods/${id}/public`);
  return response.data as TPaymentMethodResponse;
}

// GET All Payment Methods (Admin)
export async function fetchPaymentMethods(
  query?: Record<string, unknown>,
): Promise<TPaymentMethodsResponse> {
  const response = await api.get("/api/payment-methods", { params: query });
  return response.data as TPaymentMethodsResponse;
}

// GET Single Payment Method by ID (Admin)
export async function fetchPaymentMethod(
  id: string,
): Promise<TPaymentMethodResponse> {
  const response = await api.get(`/api/payment-methods/${id}`);
  return response.data as TPaymentMethodResponse;
}

// POST Create Payment Method (Admin)
export async function createPaymentMethod(
  payload: Partial<TPaymentMethod>,
): Promise<TPaymentMethodResponse> {
  const response = await api.post("/api/payment-methods", payload);
  return response.data as TPaymentMethodResponse;
}

// PATCH Update Payment Method (Admin)
export async function updatePaymentMethod(
  id: string,
  payload: Partial<TPaymentMethod>,
): Promise<TPaymentMethodResponse> {
  const response = await api.patch(`/api/payment-methods/${id}`, payload);
  return response.data as TPaymentMethodResponse;
}

// PATCH Bulk Update Payment Methods (Admin)
export async function updatePaymentMethods(payload: {
  ids: string[];
  is_active?: boolean;
}): Promise<TPaymentMethodsResponse> {
  const response = await api.patch("/api/payment-methods/bulk", payload);
  return response.data as TPaymentMethodsResponse;
}

// DELETE Single Payment Method (Admin)
export async function deletePaymentMethod(
  id: string,
): Promise<TPaymentMethodResponse> {
  const response = await api.delete(`/api/payment-methods/${id}`);
  return response.data as TPaymentMethodResponse;
}

// DELETE Bulk Payment Methods (Admin)
export async function deletePaymentMethods(payload: {
  ids: string[];
}): Promise<TPaymentMethodsResponse> {
  const response = await api.delete("/api/payment-methods/bulk", {
    data: payload,
  });
  return response.data as TPaymentMethodsResponse;
}

// DELETE Single Permanent (Admin)
export async function deletePaymentMethodPermanent(
  id: string,
): Promise<TPaymentMethodResponse> {
  const response = await api.delete(`/api/payment-methods/${id}/permanent`);
  return response.data as TPaymentMethodResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deletePaymentMethodsPermanent(payload: {
  ids: string[];
}): Promise<TPaymentMethodsResponse> {
  const response = await api.delete("/api/payment-methods/bulk/permanent", {
    data: payload,
  });
  return response.data as TPaymentMethodsResponse;
}

// POST Single Restore (Admin)
export async function restorePaymentMethod(
  id: string,
): Promise<TPaymentMethodResponse> {
  const response = await api.post(`/api/payment-methods/${id}/restore`);
  return response.data as TPaymentMethodResponse;
}

// POST Bulk Restore (Admin)
export async function restorePaymentMethods(payload: {
  ids: string[];
}): Promise<TPaymentMethodsResponse> {
  const response = await api.post("/api/payment-methods/bulk/restore", payload);
  return response.data as TPaymentMethodsResponse;
}
