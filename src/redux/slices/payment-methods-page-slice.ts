import type { TPaymentMethod } from "@/types/payment-method.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface PaymentMethodsPageState {
  isEditModalOpen: boolean;
  isAddModalOpen: boolean;
  selectedPaymentMethod: TPaymentMethod | null;
}

const initialState: PaymentMethodsPageState = {
  isEditModalOpen: false,
  isAddModalOpen: false,
  selectedPaymentMethod: null,
};

export const paymentMethodsPageSlice = createSlice({
  name: "paymentMethodsPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setSelectedPaymentMethod: (
      state,
      action: PayloadAction<TPaymentMethod | null>,
    ) => {
      state.selectedPaymentMethod = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TPaymentMethod>) => {
      state.selectedPaymentMethod = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedPaymentMethod = null;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
      state.selectedPaymentMethod = null;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
      state.selectedPaymentMethod = null;
    },
    resetPaymentMethodsPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setIsAddModalOpen,
  setSelectedPaymentMethod,
  openEditModal,
  closeEditModal,
  openAddModal,
  closeAddModal,
  resetPaymentMethodsPageState,
} = paymentMethodsPageSlice.actions;

export default paymentMethodsPageSlice.reducer;

