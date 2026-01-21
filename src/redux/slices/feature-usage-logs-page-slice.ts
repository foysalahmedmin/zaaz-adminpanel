import type { TFeatureUsageLog } from "@/types/feature-usage-log.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FeatureUsageLogsPageState {
  isViewModalOpen: boolean;
  selectedLog: TFeatureUsageLog | null;
}

const initialState: FeatureUsageLogsPageState = {
  isViewModalOpen: false,
  selectedLog: null,
};

const featureUsageLogsPageSlice = createSlice({
  name: "featureUsageLogsPage",
  initialState,
  reducers: {
    openViewModal: (state, action: PayloadAction<TFeatureUsageLog>) => {
      state.selectedLog = action.payload;
      state.isViewModalOpen = true;
    },
    closeViewModal: (state) => {
      state.isViewModalOpen = false;
      state.selectedLog = null;
    },
  },
});

export const { openViewModal, closeViewModal } =
  featureUsageLogsPageSlice.actions;

export default featureUsageLogsPageSlice.reducer;
