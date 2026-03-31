import type { TResponse } from "./response.type";

export type TFile = {
  _id: string;
  name: string;
  original_name: string;
  extension: string;
  mime_type: string;
  size: number;
  url: string;
  path: string;
  key: string;
  source: "local" | "cloud" | "external";
  is_deleted: boolean;
  uploaded_by: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type TFileResponse = TResponse<TFile>;
export type TFilesResponse = TResponse<TFile[]>;
