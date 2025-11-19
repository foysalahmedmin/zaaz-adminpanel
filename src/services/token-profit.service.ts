import api from "@/lib/api";
import type {
  TTokenProfit,
  TTokenProfitResponse,
  TTokenProfitsResponse,
} from "@/types/token-profit.type";

// GET All Token Profits (Admin)
export async function fetchTokenProfits(
  query?: Record<string, any>,
): Promise<TTokenProfitsResponse> {
  const response = await api.get("/api/token-profits", { params: query });
  return response.data as TTokenProfitsResponse;
}

// GET Single Token Profit by ID (Admin)
export async function fetchTokenProfit(
  id: string,
): Promise<TTokenProfitResponse> {
  const response = await api.get(`/api/token-profits/${id}`);
  return response.data as TTokenProfitResponse;
}

// POST Create Token Profit (Admin)
export async function createTokenProfit(
  payload: Partial<TTokenProfit>,
): Promise<TTokenProfitResponse> {
  const response = await api.post("/api/token-profits", payload);
  return response.data as TTokenProfitResponse;
}

// PATCH Update Token Profit (Admin)
export async function updateTokenProfit(
  id: string,
  payload: Partial<TTokenProfit>,
): Promise<TTokenProfitResponse> {
  const response = await api.patch(`/api/token-profits/${id}`, payload);
  return response.data as TTokenProfitResponse;
}

// PATCH Bulk Update Token Profits (Admin)
export async function updateTokenProfits(payload: {
  ids: string[];
  is_active?: boolean;
}): Promise<TTokenProfitsResponse> {
  const response = await api.patch("/api/token-profits/bulk", payload);
  return response.data as TTokenProfitsResponse;
}

// DELETE Single Token Profit (Admin)
export async function deleteTokenProfit(
  id: string,
): Promise<TTokenProfitResponse> {
  const response = await api.delete(`/api/token-profits/${id}`);
  return response.data as TTokenProfitResponse;
}

// DELETE Bulk Token Profits (Admin)
export async function deleteTokenProfits(payload: {
  ids: string[];
}): Promise<TTokenProfitsResponse> {
  const response = await api.delete("/api/token-profits/bulk", { data: payload });
  return response.data as TTokenProfitsResponse;
}

// DELETE Single Permanent (Admin)
export async function deleteTokenProfitPermanent(
  id: string,
): Promise<TTokenProfitResponse> {
  const response = await api.delete(`/api/token-profits/${id}/permanent`);
  return response.data as TTokenProfitResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deleteTokenProfitsPermanent(payload: {
  ids: string[];
}): Promise<TTokenProfitsResponse> {
  const response = await api.delete("/api/token-profits/bulk/permanent", {
    data: payload,
  });
  return response.data as TTokenProfitsResponse;
}

// POST Single Restore (Admin)
export async function restoreTokenProfit(
  id: string,
): Promise<TTokenProfitResponse> {
  const response = await api.post(`/api/token-profits/${id}/restore`);
  return response.data as TTokenProfitResponse;
}

// POST Bulk Restore (Admin)
export async function restoreTokenProfits(payload: {
  ids: string[];
}): Promise<TTokenProfitsResponse> {
  const response = await api.post("/api/token-profits/bulk/restore", payload);
  return response.data as TTokenProfitsResponse;
}

