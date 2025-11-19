import type { TUserWallet } from "@/types/user-wallet.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UserWalletsPageState {
  isViewModalOpen: boolean;
  selectedUserWallet: TUserWallet | null;
}

const initialState: UserWalletsPageState = {
  isViewModalOpen: false,
  selectedUserWallet: null,
};

export const userWalletsPageSlice = createSlice({
  name: "userWalletsPage",
  initialState,
  reducers: {
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setSelectedUserWallet: (
      state,
      action: PayloadAction<TUserWallet | null>,
    ) => {
      state.selectedUserWallet = action.payload;
    },
    openViewModal: (state, action: PayloadAction<TUserWallet>) => {
      state.selectedUserWallet = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedUserWallet = null;
    },
    resetUserWalletsPageState: () => initialState,
  },
});

export const {
  setIsViewModalOpen,
  setSelectedUserWallet,
  openViewModal,
  closeViewModal,
  resetUserWalletsPageState,
} = userWalletsPageSlice.actions;

export default userWalletsPageSlice.reducer;

