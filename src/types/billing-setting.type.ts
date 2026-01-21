export interface TBillingSetting {
  _id: string;
  credit_price: number;
  currency: "USD";
  status: "active" | "inactive";
  applied_at: string;
  is_active: boolean;
  is_initial: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export type TBillingSettingsResponse = {
  success: boolean;
  message: string;
  data: TBillingSetting[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export type TBillingSettingResponse = {
  success: boolean;
  message: string;
  data: TBillingSetting;
};
