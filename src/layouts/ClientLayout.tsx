import Loader from "@/components/partials/Loader";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Button } from "@/components/ui/Button";
import { User, Wallet, CreditCard } from "lucide-react";

const ClientLayout = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          <Link to="/client/pricing" className="flex items-center gap-2">
            <div className="bg-primary size-8 rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PS</span>
            </div>
            <span className="text-foreground font-bold text-lg">Payment System</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              asChild
              variant={isActive("/client/pricing") ? "default" : "ghost"}
            >
              <Link to="/client/pricing">Pricing</Link>
            </Button>
            <Button
              asChild
              variant={isActive("/client/profile") ? "default" : "ghost"}
            >
              <Link to="/client/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
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
      <footer className="bg-card border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Payment System. All rights reserved.
            </div>
            <nav className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  isActive("/client/pricing") && "text-primary",
                )}
              >
                <Link to="/client/pricing">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pricing
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  isActive("/client/profile") && "text-primary",
                )}
              >
                <Link to="/client/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  isActive("/client/profile") && "text-primary",
                )}
              >
                <Link to="/client/profile">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;

