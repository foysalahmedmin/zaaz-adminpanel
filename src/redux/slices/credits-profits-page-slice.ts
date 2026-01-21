import type { TCreditsProfit } from "@/types/credits-profit.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface CreditsProfitsPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  isHistoryModalOpen: boolean;
  selectedCreditsProfit: TCreditsProfit | null;
}

const initialState: CreditsProfitsPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isHistoryModalOpen: false,
  selectedCreditsProfit: null,
};

export const creditsProfitsPageSlice = createSlice({
  name: "creditsProfitsPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setIsHistoryModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isHistoryModalOpen = action.payload;
    },
    setSelectedCreditsProfit: (
      state,
      action: PayloadAction<TCreditsProfit | null>,
    ) => {
      state.selectedCreditsProfit = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TCreditsProfit>) => {
      state.selectedCreditsProfit = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedCreditsProfit = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedCreditsProfit = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedCreditsProfit = null;
    },
    openHistoryModal: (state, action: PayloadAction<TCreditsProfit>) => {
      state.selectedCreditsProfit = action.payload;
      state.isHistoryModalOpen = true;
    },
    closeHistoryModal: (state) => {
      state.isHistoryModalOpen = false;
      state.selectedCreditsProfit = null;
    },
    resetCreditsProfitsPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setIsHistoryModalOpen,
  setSelectedCreditsProfit,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openHistoryModal,
  closeHistoryModal,
  resetCreditsProfitsPageState,
} = creditsProfitsPageSlice.actions;

export default creditsProfitsPageSlice.reducer;
