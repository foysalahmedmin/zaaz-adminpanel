import api from "@/lib/api";
import type {
  TPackage,
  TPackageResponse,
  TPackagesResponse,
} from "@/types/package.type";

// GET Public Packages (No Auth Required)
export async function fetchPublicPackages(
  query?: Record<string, unknown>,
): Promise<TPackagesResponse> {
  const response = await api.get("/api/packages/public", { params: query });
  return response.data as TPackagesResponse;
}

// GET All Packages (Admin)
export async function fetchPackages(
  query?: Record<string, unknown>,
): Promise<TPackagesResponse> {
  const response = await api.get("/api/packages", { params: query });
  return response.data as TPackagesResponse;
}

// GET Single Package by ID (Admin)
export async function fetchPackage(id: string): Promise<TPackageResponse> {
  const response = await api.get(`/api/packages/${id}`);
  return response.data as TPackageResponse;
}

// POST Create Package (Admin)
export async function createPackage(
  payload: Partial<TPackage>,
): Promise<TPackageResponse> {
  const response = await api.post("/api/packages", payload);
  return response.data as TPackageResponse;
}

// PATCH Update Package (Admin)
export async function updatePackage(
  id: string,
  payload: Partial<TPackage>,
): Promise<TPackageResponse> {
  const response = await api.patch(`/api/packages/${id}`, payload);
  return response.data as TPackageResponse;
}

// PATCH Bulk Update Packages (Admin)
export async function updatePackages(payload: {
  ids: string[];
  is_active?: boolean;
}): Promise<TPackagesResponse> {
  const response = await api.patch("/api/packages/bulk", payload);
  return response.data as TPackagesResponse;
}

// DELETE Single Package (Admin)
export async function deletePackage(id: string): Promise<TPackageResponse> {
  const response = await api.delete(`/api/packages/${id}`);
  return response.data as TPackageResponse;
}

// DELETE Bulk Packages (Admin)
export async function deletePackages(payload: {
  ids: string[];
}): Promise<TPackagesResponse> {
  const response = await api.delete("/api/packages/bulk", { data: payload });
  return response.data as TPackagesResponse;
}

// DELETE Single Permanent (Admin)
export async function deletePackagePermanent(
  id: string,
): Promise<TPackageResponse> {
  const response = await api.delete(`/api/packages/${id}/permanent`);
  return response.data as TPackageResponse;
}

// DELETE Bulk Permanent (Admin)
export async function deletePackagesPermanent(payload: {
  ids: string[];
}): Promise<TPackagesResponse> {
  const response = await api.delete("/api/packages/bulk/permanent", {
    data: payload,
  });
  return response.data as TPackagesResponse;
}

// POST Single Restore (Admin)
export async function restorePackage(id: string): Promise<TPackageResponse> {
  const response = await api.post(`/api/packages/${id}/restore`);
  return response.data as TPackageResponse;
}

// POST Bulk Restore (Admin)
export async function restorePackages(payload: {
  ids: string[];
}): Promise<TPackagesResponse> {
  const response = await api.post("/api/packages/bulk/restore", payload);
  return response.data as TPackagesResponse;
}

// PATCH Update Package Is Initial (Admin)
export async function updatePackageIsInitial(
  id: string,
  is_initial: boolean,
): Promise<TPackageResponse> {
  const response = await api.patch(`/api/packages/${id}/is-initial`, {
    is_initial,
  });
  return response.data as TPackageResponse;
}

