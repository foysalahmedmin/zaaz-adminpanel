import api from "@/lib/api";
import type {
  TCreditsTransaction,
  TCreditsTransactionResponse,
  TCreditsTransactionsResponse,
} from "@/types/credits-transaction.type";

// GET All Credits Transactions (Admin)
export async function fetchCreditsTransactions(
  query?: Record<string, unknown>,
): Promise<TCreditsTransactionsResponse> {
  const response = await api.get("/api/credits-transactions", {
    params: query,
  });
  return response.data as TCreditsTransactionsResponse;
}

// GET Self Credits Transactions (User/Admin)
export async function fetchSelfCreditsTransactions(
  query?: Record<string, unknown>,
): Promise<TCreditsTransactionsResponse> {
  const response = await api.get("/api/credits-transactions/self", {
    params: query,
  });
  return response.data as TCreditsTransactionsResponse;
}

// GET Single Credits Transaction by ID (Admin)
export async function fetchCreditsTransaction(
  id: string,
): Promise<TCreditsTransactionResponse> {
  const response = await api.get(`/api/credits-transactions/${id}`);
  return response.data as TCreditsTransactionResponse;
}

// POST Create Credits Transaction (Admin)
export async function createCreditsTransaction(
  payload: Partial<TCreditsTransaction>,
): Promise<TCreditsTransactionResponse> {
  const response = await api.post("/api/credits-transactions", payload);
  return response.data as TCreditsTransactionResponse;
}

// DELETE Single Credits Transaction (Admin)
export async function deleteCreditsTransaction(
  id: string,
): Promise<TCreditsTransactionResponse> {
  const response = await api.delete(`/api/credits-transactions/${id}`);
  return response.data as TCreditsTransactionResponse;
}
