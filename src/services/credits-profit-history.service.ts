import api from "@/lib/api";
import type {
  TCreditsProfitHistoriesResponse,
  TCreditsProfitHistoryResponse,
} from "@/types/credits-profit-history.type";

// GET Credits Profit Histories by Credits Profit ID (Admin)
export async function fetchCreditsProfitHistories(
  creditsProfitId: string,
  query?: Record<string, unknown>,
): Promise<TCreditsProfitHistoriesResponse> {
  const response = await api.get(
    `/api/credits-profit-histories/credits-profit/${creditsProfitId}`,
    { params: query },
  );
  return response.data as TCreditsProfitHistoriesResponse;
}

// GET Single Credits Profit History by ID (Admin)
export async function fetchCreditsProfitHistory(
  id: string,
): Promise<TCreditsProfitHistoryResponse> {
  const response = await api.get(`/api/credits-profit-histories/${id}`);
  return response.data as TCreditsProfitHistoryResponse;
}
