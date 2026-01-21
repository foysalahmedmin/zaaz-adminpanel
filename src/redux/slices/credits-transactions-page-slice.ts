import type { TCreditsTransaction } from "@/types/credits-transaction.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface CreditsTransactionsPageState {
  isViewModalOpen: boolean;
  selectedCreditsTransaction: TCreditsTransaction | null;
}

const initialState: CreditsTransactionsPageState = {
  isViewModalOpen: false,
  selectedCreditsTransaction: null,
};

export const creditsTransactionsPageSlice = createSlice({
  name: "creditsTransactionsPage",
  initialState,
  reducers: {
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setSelectedCreditsTransaction: (
      state,
      action: PayloadAction<TCreditsTransaction | null>,
    ) => {
      state.selectedCreditsTransaction = action.payload;
    },
    openViewModal: (state, action: PayloadAction<TCreditsTransaction>) => {
      state.selectedCreditsTransaction = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedCreditsTransaction = null;
    },
    resetCreditsTransactionsPageState: () => initialState,
  },
});

export const {
  setIsViewModalOpen,
  setSelectedCreditsTransaction,
  openViewModal,
  closeViewModal,
  resetCreditsTransactionsPageState,
} = creditsTransactionsPageSlice.actions;

export default creditsTransactionsPageSlice.reducer;
