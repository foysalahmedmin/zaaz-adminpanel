import api from "@/lib/api";
import type {
  TInitiatePaymentResponseData,
  TPaymentTransaction,
  TPaymentTransactionResponse,
  TPaymentTransactionStatusResponse,
  TPaymentTransactionsResponse,
} from "@/types/payment-transaction.type";

// GET All Payment Transactions (Admin)
export async function fetchPaymentTransactions(
  query?: Record<string, unknown>,
): Promise<TPaymentTransactionsResponse> {
  const response = await api.get("/api/payment-transactions", {
    params: query,
  });
  return response.data as TPaymentTransactionsResponse;
}

// GET Self Payment Transactions (User/Admin)
export async function fetchSelfPaymentTransactions(
  query?: Record<string, unknown>,
): Promise<TPaymentTransactionsResponse> {
  const response = await api.get("/api/payment-transactions/self", {
    params: query,
  });
  return response.data as TPaymentTransactionsResponse;
}

// GET Single Payment Transaction by ID (Admin)
export async function fetchPaymentTransaction(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.get(`/api/payment-transactions/${id}`);
  return response.data as TPaymentTransactionResponse;
}

// GET Payment Transaction Status (User/Admin)
export async function fetchPaymentTransactionStatus(
  id: string,
): Promise<{ data: TPaymentTransactionStatusResponse }> {
  const response = await api.get(`/api/payment-transactions/${id}/status`);
  return { data: response.data.data as TPaymentTransactionStatusResponse };
}

// POST Create Payment Transaction (Admin)
export async function createPaymentTransaction(
  payload: Partial<TPaymentTransaction>,
): Promise<TPaymentTransactionResponse> {
  const response = await api.post("/api/payment-transactions", payload);
  return response.data as TPaymentTransactionResponse;
}

// POST Initiate Payment (User/Admin)
export async function initiatePayment(payload: {
  package: string;
  plan: string;
  payment_method: string;
  return_url: string;
  cancel_url: string;
  customer_email?: string;
  customer_name?: string;
}): Promise<TInitiatePaymentResponseData> {
  const response = await api.post(
    "/api/payment-transactions/initiate",
    payload,
  );
  return response.data as TInitiatePaymentResponseData;
}

// POST Verify Payment (User/Admin)
export async function verifyPayment(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.post(`/api/payment-transactions/${id}/verify`);
  return response.data as TPaymentTransactionResponse;
}

// PATCH Update Payment Transaction (Admin)
export async function updatePaymentTransaction(
  id: string,
  payload: Partial<TPaymentTransaction>,
): Promise<TPaymentTransactionResponse> {
  const response = await api.patch(`/api/payment-transactions/${id}`, payload);
  return response.data as TPaymentTransactionResponse;
}

// DELETE Single Payment Transaction (Admin)
export async function deletePaymentTransaction(
  id: string,
): Promise<TPaymentTransactionResponse> {
  const response = await api.delete(`/api/payment-transactions/${id}`);
  return response.data as TPaymentTransactionResponse;
}
