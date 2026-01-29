import type { TNotificationRecipient } from "@/types/notification-recipient";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface NotificationsPageState {
  selectedNotification: TNotificationRecipient | null;
  isViewModalOpen: boolean;
  filters: {
    is_read: boolean | null;
    type: string | null;
  };
}

const initialState: NotificationsPageState = {
  selectedNotification: null,
  isViewModalOpen: false,
  filters: {
    is_read: null,
    type: null,
  },
};

export const notificationsPageSlice = createSlice({
  name: "notificationsPage",
  initialState,
  reducers: {
    setSelectedNotification: (
      state,
      action: PayloadAction<TNotificationRecipient | null>,
    ) => {
      state.selectedNotification = action.payload;
    },
    setIsViewModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<NotificationsPageState["filters"]>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetNotificationsPageState: () => initialState,
  },
});

export const {
  setSelectedNotification,
  setIsViewModalOpen,
  setFilters,
  resetNotificationsPageState,
} = notificationsPageSlice.actions;

export default notificationsPageSlice.reducer;
