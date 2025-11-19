import { configureStore } from "@reduxjs/toolkit";
import routeMenuReducer from "./slices/menu-slice";
import notificationReducer from "./slices/notification-slice";
import settingReducer from "./slices/setting-slice";
import userReducer from "./slices/user-slice";
import eventsPageReducer from "./slices/events-page-slice";
import usersPageReducer from "./slices/users-page-slice";
import profilePageReducer from "./slices/profile-page-slice";

export const store = configureStore({
  reducer: {
    menu: routeMenuReducer,
    setting: settingReducer,
    user: userReducer,
    notification: notificationReducer,
    eventsPage: eventsPageReducer,
    usersPage: usersPageReducer,
    profilePage: profilePageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
