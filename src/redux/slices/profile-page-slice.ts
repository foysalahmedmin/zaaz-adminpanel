import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface ShowPasswordState {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

interface ProfilePageState {
  isEditing: boolean;
  isChangingPassword: boolean;
  showPassword: ShowPasswordState;
  previewImage: string | null;
}

const initialState: ProfilePageState = {
  isEditing: false,
  isChangingPassword: false,
  showPassword: {
    current: false,
    new: false,
    confirm: false,
  },
  previewImage: null,
};

export const profilePageSlice = createSlice({
  name: "profilePage",
  initialState,
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setIsChangingPassword: (state, action: PayloadAction<boolean>) => {
      state.isChangingPassword = action.payload;
    },
    setShowPassword: (state, action: PayloadAction<ShowPasswordState>) => {
      state.showPassword = action.payload;
    },
    toggleShowPassword: (
      state,
      action: PayloadAction<"current" | "new" | "confirm">,
    ) => {
      state.showPassword[action.payload] =
        !state.showPassword[action.payload];
    },
    setPreviewImage: (state, action: PayloadAction<string | null>) => {
      state.previewImage = action.payload;
    },
    startEditing: (state) => {
      state.isEditing = true;
    },
    stopEditing: (state) => {
      state.isEditing = false;
      state.previewImage = null;
    },
    startChangingPassword: (state) => {
      state.isChangingPassword = true;
    },
    stopChangingPassword: (state) => {
      state.isChangingPassword = false;
    },
    resetProfilePageState: () => initialState,
  },
});

export const {
  setIsEditing,
  setIsChangingPassword,
  setShowPassword,
  toggleShowPassword,
  setPreviewImage,
  startEditing,
  stopEditing,
  startChangingPassword,
  stopChangingPassword,
  resetProfilePageState,
} = profilePageSlice.actions;

export default profilePageSlice.reducer;

