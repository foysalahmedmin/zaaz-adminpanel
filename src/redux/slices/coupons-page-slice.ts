import type { TCoupon } from "@/types/coupon.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CouponsPageState {
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  selectedCoupon: TCoupon | null;
}

const initialState: CouponsPageState = {
  isAddModalOpen: false,
  isEditModalOpen: false,
  selectedCoupon: null,
};

export const couponsPageSlice = createSlice({
  name: "couponsPage",
  initialState,
  reducers: {
    openAddModal: (state) => {
      state.isAddModalOpen = true;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
    },
    openEditModal: (state, action: PayloadAction<TCoupon>) => {
      state.isEditModalOpen = true;
      state.selectedCoupon = action.payload;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedCoupon = null;
    },
  },
});

export const { openAddModal, closeAddModal, openEditModal, closeEditModal } =
  couponsPageSlice.actions;

export default couponsPageSlice.reducer;
