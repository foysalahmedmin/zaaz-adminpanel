import type { TEvent } from "@/types/event.type";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface EventsPageState {
  page: number;
  limit: number;
  search: string;
  sort: string;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  selectedEvent: TEvent | null;
}

const initialState: EventsPageState = {
  page: 0,
  limit: 10,
  search: "",
  sort: "-published_at",
  isAddModalOpen: false,
  isEditModalOpen: false,
  selectedEvent: null,
};

export const eventsPageSlice = createSlice({
  name: "eventsPage",
  initialState,
  reducers: {
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
    setIsAddModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddModalOpen = action.payload;
    },
    setIsEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    setSelectedEvent: (state, action: PayloadAction<TEvent | null>) => {
      state.selectedEvent = action.payload;
    },
    openAddModal: (state) => {
      state.isAddModalOpen = true;
    },
    closeAddModal: (state) => {
      state.isAddModalOpen = false;
    },
    openEditModal: (state, action: PayloadAction<TEvent>) => {
      state.selectedEvent = action.payload;
      state.isEditModalOpen = true;
    },
    closeEditModal: (state) => {
      state.isEditModalOpen = false;
      state.selectedEvent = null;
    },
    resetEventsPageState: () => initialState,
  },
});

export const {
  setPage,
  setLimit,
  setSearch,
  setSort,
  setIsAddModalOpen,
  setIsEditModalOpen,
  setSelectedEvent,
  openAddModal,
  closeAddModal,
  openEditModal,
  closeEditModal,
  resetEventsPageState,
} = eventsPageSlice.actions;

export default eventsPageSlice.reducer;

