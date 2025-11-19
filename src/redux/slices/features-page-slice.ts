import type { TFeature } from "@/types/feature.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface FeaturesPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  selectedFeature: TFeature | null;
}

const initialState: FeaturesPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  selectedFeature: null,
};

export const featuresPageSlice = createSlice({
  name: "featuresPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setSelectedFeature: (state, action: PayloadAction<TFeature | null>) => {
      state.selectedFeature = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TFeature>) => {
      state.selectedFeature = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedFeature = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedFeature = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedFeature = null;
    },
    resetFeaturesPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setSelectedFeature,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  resetFeaturesPageState,
} = featuresPageSlice.actions;

export default featuresPageSlice.reducer;

