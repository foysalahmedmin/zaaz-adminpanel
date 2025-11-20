import api from "@/lib/api";
import type {
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
