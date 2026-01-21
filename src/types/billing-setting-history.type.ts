import type { TBillingSetting } from "@/types/billing-setting.type";

export interface TBillingSettingHistory {
  _id: string; // Add _id manually since we removed Document
  billing_setting: string | TBillingSetting;
  credit_price: number;
  currency: "USD";
  status: "active" | "inactive";
  applied_at: string;
  is_active: boolean;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
