import api from "@/lib/api";
import type {
  TCreditsProfit,
  TCreditsProfitResponse,
  TCreditsProfitsResponse,
} from "@/types/credits-profit.type";

// GET All Credits Profits (Admin)
export async function fetchCreditsProfits(
  query?: Record<string, unknown>,
): Promise<TCreditsProfitsResponse> {
  const response = await api.get("/api/credits-profits", { params: query });
  return response.data as TCreditsProfitsResponse;
}

// GET Single Credits Profit by ID (Admin)
export async function fetchCreditsProfit(
  id: string,
): Promise<TCreditsProfitResponse> {
  const response = await api.get(`/api/credits-profits/${id}`);
  return response.data as TCreditsProfitResponse;
}

// POST Create Credits Profit (Admin)
export async function createCreditsProfit(
  payload: Partial<TCreditsProfit>,
): Promise<TCreditsProfitResponse> {
  const response = await api.post("/api/credits-profits", payload);
  return response.data as TCreditsProfitResponse;
}

// PATCH Update Credits Profit (Admin)
export async function updateCreditsProfit(
  id: string,
  payload: Partial<TCreditsProfit>,
): Promise<TCreditsProfitResponse> {
  const response = await api.patch(`/api/credits-profits/${id}`, payload);
  return response.data as TCreditsProfitResponse;
}

// PATCH Bulk Update Credits Profits (Admin)
export async function updateCreditsProfits(payload: {
  ids: string[];
  is_active?: boolean;
}): Promise<TCreditsProfitsResponse> {
  const response = await api.patch("/api/credits-profits/bulk", payload);
  return response.data as TCreditsProfitsResponse;
}

// DELETE Single Credits Profit (Admin)
export async function deleteCreditsProfit(
  id: string,
): Promise<TCreditsProfitResponse> {
  const response = await api.delete(`/api/credits-profits/${id}`);
  return response.data as TCreditsProfitResponse;
}

// DELETE Bulk Credits Profits (Admin)
export async function deleteCreditsProfits(payload: {
  ids: string[];
}): Promise<TCreditsProfitsResponse> {
  const response = await api.delete("/api/credits-profits/bulk", {
    data: payload,
  });
  return response.data as TCreditsProfitsResponse;
}

// DELETE Single Permanent (Admin)
export async function deleteCreditsProfitPermanent(
  id: string,
): Promise<TCreditsProfitResponse> {
  const response = await api.delete(`/api/credits-profits/${id}/permanent`);
  return response.data as TCreditsProfitResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deleteCreditsProfitsPermanent(payload: {
  ids: string[];
}): Promise<TCreditsProfitsResponse> {
  const response = await api.delete("/api/credits-profits/bulk/permanent", {
    data: payload,
  });
  return response.data as TCreditsProfitsResponse;
}

// POST Single Restore (Admin)
export async function restoreCreditsProfit(
  id: string,
): Promise<TCreditsProfitResponse> {
  const response = await api.post(`/api/credits-profits/${id}/restore`);
  return response.data as TCreditsProfitResponse;
}

// POST Bulk Restore (Admin)
export async function restoreCreditsProfits(payload: {
  ids: string[];
}): Promise<TCreditsProfitsResponse> {
  const response = await api.post("/api/credits-profits/bulk/restore", payload);
  return response.data as TCreditsProfitsResponse;
}
