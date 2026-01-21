import type { TPackageTransaction } from "@/services/package-transaction.service";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PackageTransactionsPageState {
  isViewModalOpen: boolean;
  selectedPackageTransaction: TPackageTransaction | null;
}

const initialState: PackageTransactionsPageState = {
  isViewModalOpen: false,
  selectedPackageTransaction: null,
};

export const packageTransactionsPageSlice = createSlice({
  name: "packageTransactionsPage",
  initialState,
  reducers: {
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setSelectedPackageTransaction: (
      state,
      action: PayloadAction<TPackageTransaction | null>,
    ) => {
      state.selectedPackageTransaction = action.payload;
    },
    openViewModal: (state, action: PayloadAction<TPackageTransaction>) => {
      state.selectedPackageTransaction = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedPackageTransaction = null;
    },
    resetPackageTransactionsPageState: () => initialState,
  },
});

export const {
  setIsViewModalOpen,
  setSelectedPackageTransaction,
  openViewModal,
  closeViewModal,
  resetPackageTransactionsPageState,
} = packageTransactionsPageSlice.actions;

export default packageTransactionsPageSlice.reducer;
