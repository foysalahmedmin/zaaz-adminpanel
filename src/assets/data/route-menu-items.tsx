import AuthWrapper from "@/components/wrappers/AuthWrapper";
import Dashboard from "@/pages/(common)/Dashboard";
import EventsPage from "@/pages/(common)/EventsPage";
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
    name: "Events",
  },
  {
    roles: ["supper-admin", "admin"],
    icon: "calendar",
    path: "events",
    name: "Events",
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
        name: "Events",
        element: (
          <AuthWrapper roles={["supper-admin", "admin"]}>
            <EventsPage />
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
      <AuthWrapper>
        <>{/*TODO: Add your recycle bin page here  */}</>
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
