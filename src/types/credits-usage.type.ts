export interface TCreditsUsage {
  _id: string;
  user: string | { _id: string; [key: string]: any };
  email?: string;
  user_wallet:
    | string
    | {
        _id: string;
        credits: number;
        [key: string]: any;
      };
  usage_key: string;
  credits_transaction: string | { _id: string; [key: string]: any };
  credit_price?: number;
  ai_model?: string;
  input_tokens?: number;
  output_tokens?: number;
  input_credits?: number;
  output_credits?: number;
  input_token_price?: number;
  output_token_price?: number;
  profit_credits_percentage?: number;
  profit_credits?: number;
  cost_credits?: number;
  credits?: number;
  price?: number;
  rounding_credits?: number;
  rounding_price?: number;
  cost_price?: number;
  is_active?: boolean;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}
