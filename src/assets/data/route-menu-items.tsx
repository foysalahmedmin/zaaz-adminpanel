import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AiModelsPage from "@/pages/(common)/AiModelsPage";
import BillingSettingsPage from "@/pages/(common)/BillingSettingsPage";
import CouponsPage from "@/pages/(common)/CouponsPage";
import CreditsProfitsDetailsPage from "@/pages/(common)/CreditsProfitsDetailsPage";
import CreditsProfitsPage from "@/pages/(common)/CreditsProfitsPage";
import CreditsTransactionsDetailsPage from "@/pages/(common)/CreditsTransactionsDetailsPage";
import CreditsTransactionsPage from "@/pages/(common)/CreditsTransactionsPage";
import CreditsUsagesPage from "@/pages/(common)/CreditsUsagesPage";
import Dashboard from "@/pages/(common)/Dashboard";
import FeatureFeedbacksPage from "@/pages/(common)/FeatureFeedbacksPage";
import FeaturePopupsPage from "@/pages/(common)/FeaturePopupsPage";
import FeatureUsageLogsPage from "@/pages/(common)/FeatureUsageLogsPage";
import FeaturesDetailsPage from "@/pages/(common)/FeaturesDetailsPage";
import FeaturesPage from "@/pages/(common)/FeaturesPage";
import NotificationsPage from "@/pages/(common)/NotificationsPage";
import PackageTransactionsPage from "@/pages/(common)/PackageTransactionsPage";
import PackagesDetailsPage from "@/pages/(common)/PackagesDetailsPage";
import PackagesPage from "@/pages/(common)/PackagesPage";
import PaymentMethodsPage from "@/pages/(common)/PaymentMethodsPage";
import PaymentTransactionsDetailsPage from "@/pages/(common)/PaymentTransactionsDetailsPage";
import PaymentTransactionsPage from "@/pages/(common)/PaymentTransactionsPage";
import PlansPage from "@/pages/(common)/PlansPage";
import RecycleBinPage from "@/pages/(common)/RecycleBinPage";
import UserDetailsPage from "@/pages/(common)/UserDetailsPage";
import UserWalletsDetailsPage from "@/pages/(common)/UserWalletsDetailsPage";
import UserWalletsPage from "@/pages/(common)/UserWalletsPage";
import UsersPage from "@/pages/(common)/UsersPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import type { TItem } from "@/types/route-menu.type";
import { Outlet } from "react-router";

export const items: TItem[] = [
  {
    menuType: "title",
    name: "Dashboard",
  },
  {
    icon: "layout-template",
    index: true,
    name: "Dashboard",
    element: (
      <AuthWrapper>
        <Dashboard />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    menuType: "title",
    name: "Management",
  },
  {
    roles: ["super-admin", "admin"],
    icon: "users",
    path: "users",
    name: "Users",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Users",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <UsersPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <UserDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "wallet",
    path: "user-wallets",
    name: "User Wallets",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "User Wallets",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <UserWalletsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <UserWalletsDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    menuType: "title",
    name: "Payment System",
  },
  {
    roles: ["super-admin", "admin"],
    icon: "cpu",
    path: "ai-models",
    name: "AI Models",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <AiModelsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    icon: "calendar",
    path: "plans",
    name: "Plans",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Plans",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PlansPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "package",
    path: "packages",
    name: "Packages",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Packages",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PackagesPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PackagesDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "ticket",
    path: "coupons",
    name: "Coupons",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <CouponsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    icon: "layout-template",
    path: "features",
    name: "Features",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Features",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <FeaturesPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <FeaturesDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "square-stack",
    path: "feature-popups",
    name: "Feature Popups",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Feature Popups",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <FeaturePopupsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "credit-card",
    path: "payment-methods",
    name: "Payment Methods",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Payment Methods",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PaymentMethodsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "percent",
    path: "credits-profits",
    name: "Credits Profits",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Credits Profits",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <CreditsProfitsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <CreditsProfitsDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "settings",
    path: "billing-settings",
    name: "Billing Settings",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <BillingSettingsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    menuType: "title",
    name: "Activities",
  },
  {
    roles: ["super-admin", "admin"],
    icon: "receipt",
    path: "payment-transactions",
    name: "Payment Transactions",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Payment Transactions",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PaymentTransactionsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PaymentTransactionsDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "shopping-bag",
    path: "package-transactions",
    name: "Package Transactions",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Package Transactions",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <PackageTransactionsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "coins",
    path: "credits-transactions",
    name: "Credits Transactions",
    routeType: "layout",
    menuType: "item-without-children",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        name: "Credits Transactions",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <CreditsTransactionsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <CreditsTransactionsDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["super-admin", "admin"],
    icon: "activity",
    path: "credits-usages",
    name: "Credits Usages",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <CreditsUsagesPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    icon: "history",
    path: "feature-usage-logs",
    name: "Feature Usage Logs",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
        <FeatureUsageLogsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["supper-admin", "admin"],
    menuType: "title",
    name: "FEATURE CONFIGS",
  },
  {
    roles: ["supper-admin", "admin"],
    menuType: "title",
    name: "RECYCLE BIN",
  },
  {
    roles: ["super-admin", "admin"],
    icon: "bell",
    path: "notifications",
    name: "Notifications",
    element: (
      <AuthWrapper roles={["super-admin", "admin"]}>
        <NotificationsPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    icon: "message-square",
    path: "feature-feedbacks",
    name: "Feature Feedbacks",
    element: (
      <AuthWrapper roles={["super-admin", "admin"]}>
        <FeatureFeedbacksPage />
      </AuthWrapper>
    ),
  },
  {
    roles: ["super-admin", "admin"],
    icon: "trash",
    path: "bin",
    name: "Recycle Bin",
    element: (
      <AuthWrapper roles={["super-admin", "admin"]}>
        <RecycleBinPage />
      </AuthWrapper>
    ),
  },
  {
    menuType: "invisible",
    path: "user",
    element: (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    ),
    routeType: "layout",
    children: [
      {
        path: "profile",
        element: (
          <AuthWrapper>
            <ProfilePage />
          </AuthWrapper>
        ),
      },
    ],
  },
];
