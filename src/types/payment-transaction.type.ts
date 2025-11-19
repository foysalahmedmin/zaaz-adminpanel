import type { Response } from "./response.type";

export type TPaymentTransactionStatus = "pending" | "success" | "failed" | "refunded";
export type TCurrency = "USD" | "BDT";

export type TPaymentTransaction = {
  _id: string;
  user: string;
  user_wallet: string;
  status: TPaymentTransactionStatus;
  payment_method: string;
  gateway_transaction_id: string;
  gateway_session_id?: string;
  gateway_status?: string;
  package: string;
  amount: number;
  currency: TCurrency;
  gateway_fee?: number;
  failure_reason?: string;
  refund_id?: string;
  refunded_at?: string;
  paid_at?: string;
  failed_at?: string;
  customer_email?: string;
  customer_name?: string;
  gateway_response?: Record<string, any>;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TPaymentTransactionResponse = Response<TPaymentTransaction>;
export type TPaymentTransactionsResponse = Response<TPaymentTransaction[]>;

