import api from "@/lib/api";
import type {
  TFeatureFeedbackResponse,
  TFeatureFeedbacksResponse,
} from "@/types/feature-feedback.type";

export async function fetchFeatureFeedbacks(
  query?: Record<string, string | number | boolean | null>,
): Promise<TFeatureFeedbacksResponse> {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  const response = await api.get(`/api/feature-feedbacks?${params.toString()}`);
  return response.data;
}

export async function updateFeatureFeedback(
  id: string,
  payload: { status?: string; admin_note?: string },
): Promise<TFeatureFeedbackResponse> {
  const response = await api.patch(`/api/feature-feedbacks/${id}`, payload);
  return response.data;
}

export async function deleteFeatureFeedback(id: string) {
  const response = await api.delete(`/api/feature-feedbacks/${id}`);
  return response.data;
}

export async function deleteFeatureFeedbacks(ids: string[]) {
  const response = await api.delete(`/api/feature-feedbacks/bulk`, {
    data: { ids },
  });
  return response.data;
}

export async function updateFeatureFeedbacksStatus(
  ids: string[],
  status: string,
) {
  const response = await api.patch(`/api/feature-feedbacks/bulk/status`, {
    ids,
    status,
  });
  return response.data;
}
