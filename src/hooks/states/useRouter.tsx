import { items } from "@/assets/data/route-menu-items";
import { RouteMenu } from "@/builder/RouteMenu";
import AuthWrapper from "@/components/wrappers/AuthWrapper";
import AuthLayout from "@/layouts/AuthLayout";
import ClientLayout from "@/layouts/ClientLayout";
import CommonLayout from "@/layouts/CommonLayout";
import RootLayout from "@/layouts/RootLayout";
import SignInPage from "@/pages/(auth)/SignInPage";
import SignUpPage from "@/pages/(auth)/SignUpPage";
import CheckoutCancelPage from "@/pages/(client)/CheckoutCancelPage";
import CheckoutPage from "@/pages/(client)/CheckoutPage";
import CheckoutSuccessPage from "@/pages/(client)/CheckoutSuccessPage";
import PricingPage from "@/pages/(client)/PricingPage";
import ProfilePage from "@/pages/(user)/ProfilePage";
import ErrorPage from "@/pages/(partial)/ErrorPage";
import MaintenancePage from "@/pages/(partial)/MaintenancePage";
import NotFoundPage from "@/pages/(partial)/NotFoundPage";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router";
import useUser from "./useUser";

const useAppRouter = () => {
  const { user } = useUser();
  const { info } = user || {};

  const routesData = useMemo(() => {
    const routeMenu = new RouteMenu(items);
    return routeMenu.getRoutes({ role: info?.role });
  }, [info?.role]);

  const { routes } = routesData || {};

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "",
          element: (
            <AuthWrapper>
              <CommonLayout />
            </AuthWrapper>
          ),
          children: routes || [],
        },
        {
          path: "auth",
          element: <AuthLayout />,
          children: [
            {
              path: "signin",
              element: <SignInPage />,
            },
            {
              path: "signup",
              element: <SignUpPage />,
            },
          ],
        },
        {
          path: "client",
          element: (
            <AuthWrapper>
              <ClientLayout />
            </AuthWrapper>
          ),
          children: [
            {
              path: "pricing",
              element: <PricingPage />,
            },
            {
              path: "checkout",
              element: <CheckoutPage />,
            },
            {
              path: "checkout/success",
              element: <CheckoutSuccessPage />,
            },
            {
              path: "checkout/cancel",
              element: <CheckoutCancelPage />,
            },
            {
              path: "profile",
              element: <ProfilePage />,
            },
          ],
        },
      ],
    },
    {
      path: "maintenance",
      element: <MaintenancePage />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return router;
};

export default useAppRouter;
