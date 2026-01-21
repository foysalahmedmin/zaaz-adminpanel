import type { Response, TMeta } from "./response.type";

export type TAiModel = {
  _id: string;
  name: string;
  value: string;
  provider: string;
  input_token_price: number;
  output_token_price: number;
  currency: "USD";
  is_active: boolean;
  is_initial: boolean;
  created_at: string;
  updated_at: string;
};

export type TAiModelResponse = Response<TAiModel>;
export type TAiModelsResponse = Response<TAiModel[]> & { meta: TMeta };
