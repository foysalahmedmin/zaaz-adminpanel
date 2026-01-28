import type { TResponse } from "./response.type";

export type TPaymentMethod = {
  _id: string;
  name: string;
  value: string;
  currency: "USD" | "BDT";
  description?: string;
  currencies?: string[];
  config?: Record<string, unknown>;
  is_test?: boolean;
  sequence?: number;
  is_active: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPaymentMethodResponse = TResponse<TPaymentMethod>;
export type TPaymentMethodsResponse = TResponse<TPaymentMethod[]>;
