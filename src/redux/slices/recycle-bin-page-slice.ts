import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type DeletedItemType =
  | "feature"
  | "feature-endpoint"
  | "package"
  | "credits-profit"
  | "user"
  | "package-transaction"
  | "ai-model";

interface RecycleBinPageState {
  activeTab: DeletedItemType;
  page: number;
  limit: number;
  search: string;
  sort: string;
  gte: string;
  lte: string;
}

const initialState: RecycleBinPageState = {
  activeTab: "feature",
  page: 0,
  limit: 10,
  search: "",
  sort: "-created_at",
  gte: "",
  lte: "",
};

export const recycleBinPageSlice = createSlice({
  name: "recycleBinPage",
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<DeletedItemType>) => {
      state.activeTab = action.payload;
      state.page = 0; // Reset page when switching tabs
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },
    setGte: (state, action: PayloadAction<string>) => {
      state.gte = action.payload;
    },
    setLte: (state, action: PayloadAction<string>) => {
      state.lte = action.payload;
    },
    resetRecycleBinPageState: () => initialState,
  },
});

export const {
  setActiveTab,
  setPage,
  setLimit,
  setSearch,
  setSort,
  setGte,
  setLte,
  resetRecycleBinPageState,
} = recycleBinPageSlice.actions;

export default recycleBinPageSlice.reducer;
