import type { TCreditsUsage } from "@/types/credits-usage.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CreditsUsagesPageState {
  isViewModalOpen: boolean;
  selectedCreditsUsage: TCreditsUsage | null;
}

const initialState: CreditsUsagesPageState = {
  isViewModalOpen: false,
  selectedCreditsUsage: null,
};

const creditsUsagesPageSlice = createSlice({
  name: "creditsUsagesPage",
  initialState,
  reducers: {
    openViewModal: (state, action: PayloadAction<TCreditsUsage>) => {
      state.isViewModalOpen = true;
      state.selectedCreditsUsage = action.payload;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedCreditsUsage = null;
    },
  },
});

export const { openViewModal, closeViewModal } = creditsUsagesPageSlice.actions;

export default creditsUsagesPageSlice.reducer;
