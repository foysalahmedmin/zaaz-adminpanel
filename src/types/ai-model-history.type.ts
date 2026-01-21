import type { TAiModel } from "./ai-model.type";

export type TAiModelHistory = TAiModel & {
  ai_model: TAiModel;
  created_at: string;
  updated_at: string;
};
