import api from "@/lib/api";
import type {
  TTokenProfitHistoriesResponse,
  TTokenProfitHistoryResponse,
} from "@/types/token-profit-history.type";

// GET Token Profit Histories by Token Profit ID (Admin)
export async function fetchTokenProfitHistories(
  tokenProfitId: string,
  query?: Record<string, unknown>,
): Promise<TTokenProfitHistoriesResponse> {
  const response = await api.get(
    `/api/token-profit-histories/token-profit/${tokenProfitId}`,
    { params: query },
  );
  return response.data as TTokenProfitHistoriesResponse;
}

// GET Single Token Profit History by ID (Admin)
export async function fetchTokenProfitHistory(
  id: string,
): Promise<TTokenProfitHistoryResponse> {
  const response = await api.get(`/api/token-profit-histories/${id}`);
  return response.data as TTokenProfitHistoryResponse;
}
