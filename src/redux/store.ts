import { configureStore } from "@reduxjs/toolkit";
import featuresPageReducer from "./slices/features-page-slice";
import routeMenuReducer from "./slices/menu-slice";
import notificationReducer from "./slices/notification-slice";
import packagesPageReducer from "./slices/packages-page-slice";
import paymentMethodsPageReducer from "./slices/payment-methods-page-slice";
import paymentTransactionsPageReducer from "./slices/payment-transactions-page-slice";
import plansPageReducer from "./slices/plans-page-slice";
import packagePlansPageReducer from "./slices/package-plans-page-slice";
import profilePageReducer from "./slices/profile-page-slice";
import settingReducer from "./slices/setting-slice";
import tokenProfitsPageReducer from "./slices/token-profits-page-slice";
import tokenTransactionsPageReducer from "./slices/token-transactions-page-slice";
import userReducer from "./slices/user-slice";
import userWalletsPageReducer from "./slices/user-wallets-page-slice";
import usersPageReducer from "./slices/users-page-slice";
import recycleBinPageReducer from "./slices/recycle-bin-page-slice";

export const store = configureStore({
  reducer: {
    menu: routeMenuReducer,
    setting: settingReducer,
    user: userReducer,
    notification: notificationReducer,
    usersPage: usersPageReducer,
    profilePage: profilePageReducer,
    featuresPage: featuresPageReducer,
    plansPage: plansPageReducer,
    packagePlansPage: packagePlansPageReducer,
    packagesPage: packagesPageReducer,
    paymentMethodsPage: paymentMethodsPageReducer,
    paymentTransactionsPage: paymentTransactionsPageReducer,
    tokenTransactionsPage: tokenTransactionsPageReducer,
    tokenProfitsPage: tokenProfitsPageReducer,
    userWalletsPage: userWalletsPageReducer,
    recycleBinPage: recycleBinPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
