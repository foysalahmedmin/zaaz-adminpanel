import api from "@/lib/api";
import type { TPackage } from "@/types/package.type";
import type { TPlan } from "@/types/plan.type";
import type { Response } from "@/types/response.type";
import type { TUser } from "@/types/user.type";

export type TPackageTransaction = {
  _id: string;
  user: string | Partial<TUser>;
  email?: string;
  user_wallet: string;
  package: string | Partial<TPackage>;
  plan: string | Partial<TPlan>;
  credits: number;
  increase_source: "payment" | "bonus";
  payment_transaction?: string;
  is_deleted?: boolean;
  created_at: string;
  updated_at: string;
};

export type TPackageTransactionsResponse = Response<TPackageTransaction[]>;
export type TPackageTransactionResponse = Response<TPackageTransaction>;

// GET All Package Transactions (Admin)
export async function fetchPackageTransactions(
  query?: Record<string, unknown>,
): Promise<TPackageTransactionsResponse> {
  const response = await api.get("/api/package-transactions", {
    params: query,
  });
  return response.data as TPackageTransactionsResponse;
}

// GET Self Package Transactions (User/Admin)
export async function fetchSelfPackageTransactions(
  query?: Record<string, unknown>,
): Promise<TPackageTransactionsResponse> {
  const response = await api.get("/api/package-transactions/self", {
    params: query,
  });
  return response.data as TPackageTransactionsResponse;
}

// GET Single Package Transaction by ID (Admin)
export async function fetchPackageTransaction(
  id: string,
): Promise<TPackageTransactionResponse> {
  const response = await api.get(`/api/package-transactions/${id}`);
  return response.data as TPackageTransactionResponse;
}

// DELETE Single Package Transaction (Admin)
export async function deletePackageTransaction(
  id: string,
): Promise<TPackageTransactionResponse> {
  const response = await api.delete(`/api/package-transactions/${id}`);
  return response.data as TPackageTransactionResponse;
}

// DELETE Permanent
export async function deletePackageTransactionPermanent(
  id: string,
): Promise<TPackageTransactionResponse> {
  const response = await api.delete(
    `/api/package-transactions/${id}/permanent`,
  );
  return response.data as TPackageTransactionResponse;
}

// POST Restore
export async function restorePackageTransaction(
  id: string,
): Promise<TPackageTransactionResponse> {
  const response = await api.post(`/api/package-transactions/${id}/restore`);
  return response.data as TPackageTransactionResponse;
}
