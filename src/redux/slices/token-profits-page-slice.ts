import type { TTokenProfit } from "@/types/token-profit.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface TokenProfitsPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  isHistoryModalOpen: boolean;
  selectedTokenProfit: TTokenProfit | null;
}

const initialState: TokenProfitsPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isHistoryModalOpen: false,
  selectedTokenProfit: null,
};

export const tokenProfitsPageSlice = createSlice({
  name: "tokenProfitsPage",
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
    setSelectedTokenProfit: (
      state,
      action: PayloadAction<TTokenProfit | null>,
    ) => {
      state.selectedTokenProfit = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TTokenProfit>) => {
      state.selectedTokenProfit = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedTokenProfit = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedTokenProfit = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedTokenProfit = null;
    },
    openHistoryModal: (state, action: PayloadAction<TTokenProfit>) => {
      state.selectedTokenProfit = action.payload;
      state.isHistoryModalOpen = true;
    },
    closeHistoryModal: (state) => {
      state.isHistoryModalOpen = false;
      state.selectedTokenProfit = null;
    },
    resetTokenProfitsPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setIsHistoryModalOpen,
  setSelectedTokenProfit,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openHistoryModal,
  closeHistoryModal,
  resetTokenProfitsPageState,
} = tokenProfitsPageSlice.actions;

export default tokenProfitsPageSlice.reducer;

