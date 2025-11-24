import type { TPackagePlan } from "@/types/package-plan.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PackagePlansPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  selectedPackagePlan: TPackagePlan | null;
}

const initialState: PackagePlansPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  selectedPackagePlan: null,
};

export const packagePlansPageSlice = createSlice({
  name: "packagePlansPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setSelectedPackagePlan: (
      state,
      action: PayloadAction<TPackagePlan | null>,
    ) => {
      state.selectedPackagePlan = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TPackagePlan>) => {
      state.selectedPackagePlan = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedPackagePlan = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedPackagePlan = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedPackagePlan = null;
    },
    openViewModal: (state, action: PayloadAction<TPackagePlan>) => {
      state.selectedPackagePlan = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedPackagePlan = null;
    },
    resetPackagePlansPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setIsViewModalOpen,
  setSelectedPackagePlan,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openViewModal,
  closeViewModal,
  resetPackagePlansPageState,
} = packagePlansPageSlice.actions;

export default packagePlansPageSlice.reducer;

