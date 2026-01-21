import api from "@/lib/api";
import type { TAiModelHistory } from "@/types/ai-model-history.type";
import type { Response } from "@/types/response.type";

export const fetchAiModelHistories = async (
  aiModelId: string,
  params?: Record<string, unknown>,
): Promise<Response<TAiModelHistory[]>> => {
  const response = await api.get(
    `/api/ai-model-histories/ai-model/${aiModelId}`,
    {
      params,
    },
  );
  return response.data;
};
