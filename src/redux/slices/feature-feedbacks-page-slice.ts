import type { TFeatureFeedback } from "@/types/feature-feedback.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface FeatureFeedbacksPageState {
  selectedFeedback: TFeatureFeedback | null;
  isViewModalOpen: boolean;
  filters: {
    status: string | null;
    category: string | null;
  };
}

const initialState: FeatureFeedbacksPageState = {
  selectedFeedback: null,
  isViewModalOpen: false,
  filters: {
    status: null,
    category: null,
  },
};

export const featureFeedbacksPageSlice = createSlice({
  name: "featureFeedbacksPage",
  initialState,
  reducers: {
    setSelectedFeedback: (
      state,
      action: PayloadAction<TFeatureFeedback | null>,
    ) => {
      state.selectedFeedback = action.payload;
    },
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<FeatureFeedbacksPageState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFeatureFeedbacksPageState: () => initialState,
  },
});

export const {
  setSelectedFeedback,
  setIsViewModalOpen,
  setFilters,
  resetFeatureFeedbacksPageState,
} = featureFeedbacksPageSlice.actions;

export default featureFeedbacksPageSlice.reducer;
