import api from "@/lib/api";
import type { TBillingSettingHistory } from "@/types/billing-setting-history.type";
import type { TResponse } from "@/types/response.type";

export const fetchBillingSettingHistories = async (
  billingSettingId: string,
  params?: Record<string, unknown>,
): Promise<TResponse<TBillingSettingHistory[]>> => {
  const response = await api.get(
    `/api/billing-setting-histories/billing-setting/${billingSettingId}`,
    {
      params,
    },
  );
  return response.data;
};
