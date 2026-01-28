import { configureStore } from "@reduxjs/toolkit";
import aiModelsPageReducer from "./slices/ai-models-page-slice";
import billingSettingsPageReducer from "./slices/billing-settings-page-slice";
import couponsPageReducer from "./slices/coupons-page-slice";
import creditsProfitsPageReducer from "./slices/credits-profits-page-slice";
import creditsTransactionsPageReducer from "./slices/credits-transactions-page-slice";
import creditsUsagesPageReducer from "./slices/credits-usages-page-slice";
import featurePopupsPageReducer from "./slices/feature-popups-page-slice";
import featureUsageLogsPageReducer from "./slices/feature-usage-logs-page-slice";
import featuresPageReducer from "./slices/features-page-slice";
import routeMenuReducer from "./slices/menu-slice";
import notificationReducer from "./slices/notification-slice";
import packagePlansPageReducer from "./slices/package-plans-page-slice";
import packageTransactionsPageReducer from "./slices/package-transactions-page-slice";
import packagesPageReducer from "./slices/packages-page-slice";
import paymentMethodsPageReducer from "./slices/payment-methods-page-slice";
import paymentTransactionsPageReducer from "./slices/payment-transactions-page-slice";
import plansPageReducer from "./slices/plans-page-slice";
import profilePageReducer from "./slices/profile-page-slice";
import recycleBinPageReducer from "./slices/recycle-bin-page-slice";
import settingReducer from "./slices/setting-slice";
import userReducer from "./slices/user-slice";
import userWalletsPageReducer from "./slices/user-wallets-page-slice";
import usersPageReducer from "./slices/users-page-slice";

export const store = configureStore({
  reducer: {
    menu: routeMenuReducer,
    setting: settingReducer,
    user: userReducer,
    notification: notificationReducer,
    usersPage: usersPageReducer,
    profilePage: profilePageReducer,
    featuresPage: featuresPageReducer,
    featureUsageLogsPage: featureUsageLogsPageReducer,
    featurePopupsPage: featurePopupsPageReducer,
    plansPage: plansPageReducer,
    packagePlansPage: packagePlansPageReducer,
    packagesPage: packagesPageReducer,
    couponsPage: couponsPageReducer,
    paymentMethodsPage: paymentMethodsPageReducer,
    paymentTransactionsPage: paymentTransactionsPageReducer,
    creditsTransactionsPage: creditsTransactionsPageReducer,
    packageTransactionsPage: packageTransactionsPageReducer,
    creditsProfitsPage: creditsProfitsPageReducer,
    userWalletsPage: userWalletsPageReducer,
    recycleBinPage: recycleBinPageReducer,
    aiModelsPage: aiModelsPageReducer,
    billingSettingsPage: billingSettingsPageReducer,
    creditsUsagesPage: creditsUsagesPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
