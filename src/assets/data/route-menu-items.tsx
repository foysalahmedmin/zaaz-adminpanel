import AuthWrapper from "@/components/wrappers/AuthWrapper";
import Dashboard from "@/pages/(common)/Dashboard";
import FeaturesDetailsPage from "@/pages/(common)/FeaturesDetailsPage";
import FeaturesPage from "@/pages/(common)/FeaturesPage";
import PackagesDetailsPage from "@/pages/(common)/PackagesDetailsPage";
import PackagesPage from "@/pages/(common)/PackagesPage";
import PaymentMethodsPage from "@/pages/(common)/PaymentMethodsPage";
import PaymentTransactionsDetailsPage from "@/pages/(common)/PaymentTransactionsDetailsPage";
import PaymentTransactionsPage from "@/pages/(common)/PaymentTransactionsPage";
import RecycleBinPage from "@/pages/(common)/RecycleBinPage";
import TokenProfitsDetailsPage from "@/pages/(common)/TokenProfitsDetailsPage";
import TokenProfitsPage from "@/pages/(common)/TokenProfitsPage";
import TokenTransactionsDetailsPage from "@/pages/(common)/TokenTransactionsDetailsPage";
import TokenTransactionsPage from "@/pages/(common)/TokenTransactionsPage";
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
    roles: ["supper-admin", "admin"],
    menuType: "title",
    name: "Management",
  },
  {
    roles: ["supper-admin", "admin"],
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
            <ProfilePage isUserView={true} />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["supper-admin", "admin"],
    menuType: "title",
    name: "Payment System",
  },
  {
    roles: ["supper-admin", "admin"],
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
    roles: ["supper-admin", "admin"],
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
    roles: ["supper-admin", "admin"],
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
    roles: ["supper-admin", "admin"],
    icon: "credit-card",
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
    roles: ["supper-admin", "admin"],
    icon: "coins",
    path: "token-transactions",
    name: "Token Transactions",
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
        name: "Token Transactions",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <TokenTransactionsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <TokenTransactionsDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["supper-admin", "admin"],
    icon: "percent",
    path: "token-profits",
    name: "Token Profits",
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
        name: "Token Profits",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <TokenProfitsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
      {
        path: ":id",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <TokenProfitsDetailsPage />
          </AuthWrapper>
        ),
        menuType: "invisible",
      },
    ],
  },
  {
    roles: ["supper-admin", "admin"],
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
    roles: ["supper-admin", "admin"],
    menuType: "title",
    name: "Activities",
  },
  {
    roles: ["supper-admin", "admin"],
    icon: "trash",
    path: "bin",
    name: "Recycle Bin",
    element: (
      <AuthWrapper roles={["supper-admin", "admin"]}>
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
