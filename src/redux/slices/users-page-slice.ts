import type { TUser } from "@/types/user.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface UsersPageState {
  isEditModalOpen: boolean;
  selectedUser: TUser | null;
}

const initialState: UsersPageState = {
  isEditModalOpen: false,
  selectedUser: null,
};

export const usersPageSlice = createSlice({
  name: "usersPage",
  initialState,
  reducers: {
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<TUser | null>) => {
      state.selectedUser = action.payload;
    },
    openEditModal: (state, action: PayloadAction<TUser>) => {
      state.selectedUser = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedUser = null;
    },
    resetUsersPageState: () => initialState,
  },
});

export const {
  setIsEditModalOpen,
  setSelectedUser,
  openEditModal,
  closeEditModal,
  resetUsersPageState,
} = usersPageSlice.actions;

export default usersPageSlice.reducer;

