import type { TAiModel } from "@/types/ai-model.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface AiModelsPageState {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
  isHistoryModalOpen: boolean;
  selectedAiModel: TAiModel | null;
}

const initialState: AiModelsPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  isHistoryModalOpen: false,
  selectedAiModel: null,
};

export const aiModelsPageSlice = createSlice({
  name: "aiModelsPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setSelectedAiModel: (state, action: PayloadAction<TAiModel | null>) => {
      state.selectedAiModel = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TAiModel>) => {
      state.selectedAiModel = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedAiModel = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedAiModel = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedAiModel = null;
    },
    openHistoryModal: (state, action: PayloadAction<TAiModel>) => {
      state.selectedAiModel = action.payload;
      state.isHistoryModalOpen = true;
    },
    closeHistoryModal: (state) => {
      state.isHistoryModalOpen = false;
      state.selectedAiModel = null;
    },
    openViewModal: (state, action: PayloadAction<TAiModel>) => {
      state.selectedAiModel = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedAiModel = null;
    },
    resetAiModelsPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setSelectedAiModel,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openHistoryModal,
  closeHistoryModal,
  openViewModal,
  closeViewModal,
  resetAiModelsPageState,
} = aiModelsPageSlice.actions;

export default aiModelsPageSlice.reducer;
