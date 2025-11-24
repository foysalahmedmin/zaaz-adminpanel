import type { TPlan } from "@/types/plan.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PlansPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  isViewModalOpen: boolean;
  selectedPlan: TPlan | null;
}

const initialState: PlansPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  selectedPlan: null,
};

export const plansPageSlice = createSlice({
  name: "plansPage",
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
    setSelectedPlan: (state, action: PayloadAction<TPlan | null>) => {
      state.selectedPlan = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TPlan>) => {
      state.selectedPlan = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedPlan = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedPlan = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedPlan = null;
    },
    openViewModal: (state, action: PayloadAction<TPlan>) => {
      state.selectedPlan = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedPlan = null;
    },
    resetPlansPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setIsViewModalOpen,
  setSelectedPlan,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openViewModal,
  closeViewModal,
  resetPlansPageState,
} = plansPageSlice.actions;

export default plansPageSlice.reducer;

