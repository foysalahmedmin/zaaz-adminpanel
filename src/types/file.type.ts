import type { TResponse } from "./response.type";

export type TFileType = "image" | "video" | "audio" | "file" | "pdf" | "doc" | "txt";
export type TFileStatus = "active" | "inactive" | "archived";
export type TFileProvider = "local" | "gcs";

export type TFile = {
  _id: string;
  filename: string;
  originalname: string;
  name: string;
  url: string;
  mimetype: string;
  size: number;
  author: string;
  provider: TFileProvider;
  category?: string;
  description?: string;
  caption?: string;
  status: TFileStatus;
  is_deleted: boolean;
  metadata?: {
    path?: string;
    bucket?: string;
    extension?: string;
    file_type?: TFileType;
  };
  created_at?: string;
  updated_at?: string;
};

export type TFileResponse = TResponse<TFile>;
export type TFilesResponse = TResponse<TFile[]>;
