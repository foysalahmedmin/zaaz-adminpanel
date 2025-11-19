import type { TPackage } from "@/types/package.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PackagesPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  isHistoryModalOpen: boolean;
  selectedPackage: TPackage | null;
}

const initialState: PackagesPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isHistoryModalOpen: false,
  selectedPackage: null,
};

export const packagesPageSlice = createSlice({
  name: "packagesPage",
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
    setSelectedPackage: (state, action: PayloadAction<TPackage | null>) => {
      state.selectedPackage = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TPackage>) => {
      state.selectedPackage = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedPackage = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedPackage = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedPackage = null;
    },
    openHistoryModal: (state, action: PayloadAction<TPackage>) => {
      state.selectedPackage = action.payload;
      state.isHistoryModalOpen = true;
    },
    closeHistoryModal: (state) => {
      state.isHistoryModalOpen = false;
      state.selectedPackage = null;
    },
    resetPackagesPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setIsHistoryModalOpen,
  setSelectedPackage,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openHistoryModal,
  closeHistoryModal,
  resetPackagesPageState,
} = packagesPageSlice.actions;

export default packagesPageSlice.reducer;

