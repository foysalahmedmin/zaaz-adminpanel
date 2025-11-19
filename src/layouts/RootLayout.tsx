import MenuApplier from "@/components/appliers/MenuApplier";
import SettingApplier from "@/components/appliers/SettingApplier";
import ToastApplier from "@/components/appliers/ToastApplier";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <>
      <MenuApplier />
      <SettingApplier />
      <ToastApplier />
      <Outlet />
    </>
  );
};

export default RootLayout;
