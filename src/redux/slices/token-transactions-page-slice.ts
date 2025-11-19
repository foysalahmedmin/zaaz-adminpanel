import type { TTokenTransaction } from "@/types/token-transaction.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface TokenTransactionsPageState {
  isViewModalOpen: boolean;
  selectedTokenTransaction: TTokenTransaction | null;
}

const initialState: TokenTransactionsPageState = {
  isViewModalOpen: false,
  selectedTokenTransaction: null,
};

export const tokenTransactionsPageSlice = createSlice({
  name: "tokenTransactionsPage",
  initialState,
  reducers: {
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setSelectedTokenTransaction: (
      state,
      action: PayloadAction<TTokenTransaction | null>,
    ) => {
      state.selectedTokenTransaction = action.payload;
    },
    openViewModal: (state, action: PayloadAction<TTokenTransaction>) => {
      state.selectedTokenTransaction = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedTokenTransaction = null;
    },
    resetTokenTransactionsPageState: () => initialState,
  },
});

export const {
  setIsViewModalOpen,
  setSelectedTokenTransaction,
  openViewModal,
  closeViewModal,
  resetTokenTransactionsPageState,
} = tokenTransactionsPageSlice.actions;

export default tokenTransactionsPageSlice.reducer;

