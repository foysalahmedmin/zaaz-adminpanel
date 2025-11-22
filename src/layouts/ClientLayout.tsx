import Loader from "@/components/partials/Loader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CreditCard, User, Wallet } from "lucide-react";
import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router";

const ClientLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-card sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          <Link to="/client/pricing" className="flex items-center gap-2">
            <div className="bg-primary flex size-8 items-center justify-center rounded-md">
              <span className="text-primary-foreground text-sm font-bold">
                PS
              </span>
            </div>
            <span className="text-foreground text-lg font-bold">
              Payment System
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/client/pricing">
              <Button
                asChild
                variant={isActive("/client/pricing") ? "default" : "ghost"}
              >
                <Wallet className="h-4 w-4" />
                Pricing
              </Button>
            </Link>

            <Link to="/client/profile">
              <Button
                asChild
                variant={isActive("/client/profile") ? "default" : "ghost"}
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-card mt-auto border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Payment System. All rights reserved.
            </div>
            <nav className="flex items-center gap-4">
              <Link to="/client/pricing">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(isActive("/client/pricing") && "text-primary")}
                >
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pricing
                  </>
                </Button>
              </Link>

              <Link to="/client/profile">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(isActive("/client/profile") && "text-primary")}
                >
                  <>
                    <User className="h-4 w-4" />
                    Profile
                  </>
                </Button>
              </Link>

              <Link to="/client/wallet">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(isActive("/client/wallet") && "text-primary")}
                >
                  <>
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </>
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
