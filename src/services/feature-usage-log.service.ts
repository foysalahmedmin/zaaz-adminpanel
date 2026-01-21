import api from "@/lib/api";
import type {
  TFeatureUsageLogResponse,
  TFeatureUsageLogsResponse,
} from "@/types/feature-usage-log.type";

// GET All Feature Usage Logs (Admin)
export async function fetchFeatureUsageLogs(
  query?: Record<string, unknown>,
): Promise<TFeatureUsageLogsResponse> {
  const response = await api.get("/api/feature-usage-logs", { params: query });
  return response.data as TFeatureUsageLogsResponse;
}

// GET Single Feature Usage Log by ID (Admin)
export async function fetchFeatureUsageLogById(
  id: string,
): Promise<TFeatureUsageLogResponse> {
  const response = await api.get(`/api/feature-usage-logs/${id}`);
  return response.data as TFeatureUsageLogResponse;
}

// DELETE Feature Usage Log (Admin) - Soft Delete
export async function deleteFeatureUsageLog(
  id: string,
): Promise<TFeatureUsageLogResponse> {
  const response = await api.delete(`/api/feature-usage-logs/${id}`);
  return response.data as TFeatureUsageLogResponse;
}

// DELETE Feature Usage Log (Admin) - Permanent Delete
export async function deleteFeatureUsageLogPermanent(
  id: string,
): Promise<TFeatureUsageLogResponse> {
  const response = await api.delete(`/api/feature-usage-logs/${id}/permanent`);
  return response.data as TFeatureUsageLogResponse;
}

// DELETE Multiple Feature Usage Logs (Admin) - Soft Delete
export async function deleteFeatureUsageLogs(
  ids: string[],
): Promise<{ count: number; not_found_ids: string[] }> {
  const response = await api.delete("/api/feature-usage-logs/bulk", {
    data: { ids },
  });
  return response.data;
}

// DELETE Multiple Feature Usage Logs (Admin) - Permanent Delete
export async function deleteFeatureUsageLogsPermanent(
  ids: string[],
): Promise<{ count: number; not_found_ids: string[] }> {
  const response = await api.delete("/api/feature-usage-logs/bulk/permanent", {
    data: { ids },
  });
  return response.data;
}
