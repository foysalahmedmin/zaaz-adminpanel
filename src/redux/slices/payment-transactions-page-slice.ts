import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PaymentTransactionsPageState {
  isViewModalOpen: boolean;
  selectedPaymentTransaction: TPaymentTransaction | null;
}

const initialState: PaymentTransactionsPageState = {
  isViewModalOpen: false,
  selectedPaymentTransaction: null,
};

export const paymentTransactionsPageSlice = createSlice({
  name: "paymentTransactionsPage",
  initialState,
  reducers: {
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setSelectedPaymentTransaction: (
      state,
      action: PayloadAction<TPaymentTransaction | null>,
    ) => {
      state.selectedPaymentTransaction = action.payload;
    },
    openViewModal: (state, action: PayloadAction<TPaymentTransaction>) => {
      state.selectedPaymentTransaction = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedPaymentTransaction = null;
    },
    resetPaymentTransactionsPageState: () => initialState,
  },
});

export const {
  setIsViewModalOpen,
  setSelectedPaymentTransaction,
  openViewModal,
  closeViewModal,
  resetPaymentTransactionsPageState,
} = paymentTransactionsPageSlice.actions;

export default paymentTransactionsPageSlice.reducer;

