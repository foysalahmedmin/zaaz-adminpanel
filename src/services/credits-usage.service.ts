import api from "@/lib/api";
import type { TCreditsUsage } from "@/types/credits-usage.type";

export type TCreditsUsagesResponse = {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
    statistics?: {
      total_cost_credits: number;
      total_profit: number;
      total_rounding: number;
      total_credits: number;
      total_price: number;
      total_input_tokens: number;
      total_output_tokens: number;
    };
  };
  data: TCreditsUsage[];
};

export type TCreditsUsageResponse = {
  success: boolean;
  message: string;
  data: TCreditsUsage;
};

// GET All Credits Usage Logs (Admin)
export async function fetchCreditsUsages(
  query?: Record<string, unknown>,
): Promise<TCreditsUsagesResponse> {
  const response = await api.get("/api/credits-usages", { params: query });
  return response.data as TCreditsUsagesResponse;
}

// GET Single Credits Usage Log by ID (Admin)
export async function fetchCreditsUsageById(
  id: string,
): Promise<TCreditsUsageResponse> {
  const response = await api.get(`/api/credits-usages/${id}`);
  return response.data as TCreditsUsageResponse;
}

// DELETE Credits Usage Log (Admin)
export async function deleteCreditsUsage(
  id: string,
): Promise<TCreditsUsageResponse> {
  const response = await api.delete(`/api/credits-usages/${id}`);
  return response.data as TCreditsUsageResponse;
}
