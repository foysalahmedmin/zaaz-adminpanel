import api from "@/lib/api";
import type {
  TTokenTransaction,
  TTokenTransactionResponse,
  TTokenTransactionsResponse,
} from "@/types/token-transaction.type";

// GET All Token Transactions (Admin)
export async function fetchTokenTransactions(
  query?: Record<string, any>,
): Promise<TTokenTransactionsResponse> {
  const response = await api.get("/api/token-transactions", { params: query });
  return response.data as TTokenTransactionsResponse;
}

// GET Self Token Transactions (User/Admin)
export async function fetchSelfTokenTransactions(
  query?: Record<string, any>,
): Promise<TTokenTransactionsResponse> {
  const response = await api.get("/api/token-transactions/self", {
    params: query,
  });
  return response.data as TTokenTransactionsResponse;
}

// GET Single Token Transaction by ID (Admin)
export async function fetchTokenTransaction(
  id: string,
): Promise<TTokenTransactionResponse> {
  const response = await api.get(`/api/token-transactions/${id}`);
  return response.data as TTokenTransactionResponse;
}

// POST Create Token Transaction (Admin)
export async function createTokenTransaction(
  payload: Partial<TTokenTransaction>,
): Promise<TTokenTransactionResponse> {
  const response = await api.post("/api/token-transactions", payload);
  return response.data as TTokenTransactionResponse;
}

// DELETE Single Token Transaction (Admin)
export async function deleteTokenTransaction(
  id: string,
): Promise<TTokenTransactionResponse> {
  const response = await api.delete(`/api/token-transactions/${id}`);
  return response.data as TTokenTransactionResponse;
}

