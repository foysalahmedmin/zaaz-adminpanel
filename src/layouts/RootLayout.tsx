import MenuApplier from "@/components/appliers/MenuApplier";
import NotificationApplier from "@/components/appliers/NotificationApplier";
import SettingApplier from "@/components/appliers/SettingApplier";
import ToastApplier from "@/components/appliers/ToastApplier";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <>
      <MenuApplier />
      <SettingApplier />
      <ToastApplier />
      <NotificationApplier />
      <Outlet />
    </>
  );
};

export default RootLayout;
