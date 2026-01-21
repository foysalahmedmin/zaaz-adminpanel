import type { TBillingSetting } from "@/types/billing-setting.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface BillingSettingsPageState {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
  isHistoryModalOpen: boolean;
  selectedBillingSetting: TBillingSetting | null;
}

const initialState: BillingSettingsPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  isViewModalOpen: false,
  isHistoryModalOpen: false,
  selectedBillingSetting: null,
};

export const billingSettingsPageSlice = createSlice({
  name: "billingSettingsPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setSelectedBillingSetting: (
      state,
      action: PayloadAction<TBillingSetting | null>,
    ) => {
      state.selectedBillingSetting = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TBillingSetting>) => {
      state.selectedBillingSetting = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedBillingSetting = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedBillingSetting = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedBillingSetting = null;
    },
    openViewModal: (state, action: PayloadAction<TBillingSetting>) => {
      state.selectedBillingSetting = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedBillingSetting = null;
    },
    openHistoryModal: (state, action: PayloadAction<TBillingSetting>) => {
      state.selectedBillingSetting = action.payload;
      state.isHistoryModalOpen = true;
    },
    closeHistoryModal: (state) => {
      state.isHistoryModalOpen = false;
      state.selectedBillingSetting = null;
    },
    resetBillingSettingsPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setSelectedBillingSetting,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  openViewModal,
  closeViewModal,
  openHistoryModal,
  closeHistoryModal,
  resetBillingSettingsPageState,
} = billingSettingsPageSlice.actions;

export default billingSettingsPageSlice.reducer;
