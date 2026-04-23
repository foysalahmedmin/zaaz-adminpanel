import api from "@/lib/api";
import type { TFileResponse, TFilesResponse } from "@/types/file.type";

export async function fetchFiles(
  query?: Record<string, unknown>,
): Promise<TFilesResponse> {
  const response = await api.get("/api/files", { params: query });
  return response.data as TFilesResponse;
}

export async function fetchFile(id: string): Promise<TFileResponse> {
  const response = await api.get(`/api/files/${id}`);
  return response.data as TFileResponse;
}

export async function uploadFiles(payload: FormData): Promise<TFilesResponse> {
  const response = await api.post("/api/files/cloud", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data as TFilesResponse;
}

export async function deleteFile(id: string): Promise<TFileResponse> {
  const response = await api.delete(`/api/files/${id}`);
  return response.data as TFileResponse;
}

export async function deleteFilePermanent(id: string): Promise<TFileResponse> {
  const response = await api.delete(`/api/files/${id}/permanent`);
  return response.data as TFileResponse;
}

export async function restoreFile(id: string): Promise<TFileResponse> {
  const response = await api.post(`/api/files/${id}/restore`);
  return response.data as TFileResponse;
}
