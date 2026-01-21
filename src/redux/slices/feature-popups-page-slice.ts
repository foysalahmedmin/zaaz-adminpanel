import type { TFeaturePopup } from "@/types/feature-popup.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface FeaturePopupsPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  selectedFeaturePopup: TFeaturePopup | null;
}

const initialState: FeaturePopupsPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  selectedFeaturePopup: null,
};

export const featurePopupsPageSlice = createSlice({
  name: "featurePopupsPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setSelectedFeaturePopup: (
      state,
      action: PayloadAction<TFeaturePopup | null>,
    ) => {
      state.selectedFeaturePopup = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TFeaturePopup>) => {
      state.selectedFeaturePopup = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedFeaturePopup = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedFeaturePopup = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedFeaturePopup = null;
    },
    resetFeaturePopupsPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setSelectedFeaturePopup,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  resetFeaturePopupsPageState,
} = featurePopupsPageSlice.actions;

export default featurePopupsPageSlice.reducer;

