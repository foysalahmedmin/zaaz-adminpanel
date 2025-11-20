import api from "@/lib/api";
import type {
  TPackageHistoryResponse,
  TPackageHistoriesResponse,
} from "@/types/package-history.type";

// GET Package Histories by Package ID (Admin)
export async function fetchPackageHistories(
  packageId: string,
  query?: Record<string, unknown>,
): Promise<TPackageHistoriesResponse> {
  const response = await api.get(`/api/package-histories/package/${packageId}`, {
    params: query,
  });
  return response.data as TPackageHistoriesResponse;
}

// GET Single Package History by ID (Admin)
export async function fetchPackageHistory(
  id: string,
): Promise<TPackageHistoryResponse> {
  const response = await api.get(`/api/package-histories/${id}`);
  return response.data as TPackageHistoryResponse;
}

