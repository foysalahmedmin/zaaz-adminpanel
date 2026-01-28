import type { TFeatureEndpoint } from "./feature-endpoint.type";
import type { TPaymentTransaction } from "./payment-transaction.type";
import type { TResponse } from "./response.type";

export type TCreditsTransactionType = "increase" | "decrease";
export type TCreditsTransactionIncreaseSource = "payment" | "bonus";

export type TCreditsTransaction = {
  _id: string;
  user: string;
  email?: string;
  user_wallet: string;
  type: TCreditsTransactionType;
  credits: number;
  increase_source?: TCreditsTransactionIncreaseSource;
  decrease_source?: string | Partial<TFeatureEndpoint> | null;
  payment_transaction?: string | Partial<TPaymentTransaction> | null;
  plan?:
    | string
    | {
        _id: string;
        name: string;
      }
    | null;
  usage_key?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TCreditsTransactionResponse = TResponse<TCreditsTransaction>;
export type TCreditsTransactionsResponse = TResponse<TCreditsTransaction[]>;
