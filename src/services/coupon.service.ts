import api from "@/lib/api";
import type {
  TCoupon,
  TCouponResponse,
  TCouponsResponse,
} from "@/types/coupon.type";

// GET All Coupons (Admin)
export async function fetchCoupons(
  query?: Record<string, unknown>,
): Promise<TCouponsResponse> {
  const response = await api.get("/api/coupons", { params: query });
  return response.data as TCouponsResponse;
}

// GET Single Coupon by ID (Admin)
export async function fetchCoupon(id: string): Promise<TCouponResponse> {
  const response = await api.get(`/api/coupons/${id}`);
  return response.data as TCouponResponse;
}

// POST Create Coupon (Admin)
export async function createCoupon(
  payload: Partial<TCoupon>,
): Promise<TCouponResponse> {
  const response = await api.post("/api/coupons", payload);
  return response.data as TCouponResponse;
}

// PATCH Update Coupon (Admin)
export async function updateCoupon(
  id: string,
  payload: Partial<TCoupon>,
): Promise<TCouponResponse> {
  const response = await api.patch(`/api/coupons/${id}`, payload);
  return response.data as TCouponResponse;
}

// DELETE Single Coupon (Admin)
export async function deleteCoupon(id: string): Promise<TCouponResponse> {
  const response = await api.delete(`/api/coupons/${id}`);
  return response.data as TCouponResponse;
}
