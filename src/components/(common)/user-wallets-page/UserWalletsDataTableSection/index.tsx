import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import type { TUserWallet } from "@/types/user-wallet.type";
import { Eye } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type UserWalletsDataTableSectionProps = {
  data?: TUserWallet[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  state?: TState;
};

const UserWalletsDataTableSection: React.FC<
  UserWalletsDataTableSectionProps
> = ({ data = [], breadcrumbs, isLoading, isError, state }) => {
  const columns: TColumn<TUserWallet>[] = [
    {
      name: "User",
      field: "user",
      isSortable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="bg-muted inline-block rounded-md px-2 py-0.5 font-mono text-xs font-medium">
            {row.user}
          </p>
        </div>
      ),
    },
    {
      name: "Email/User",
      field: "email",
      isSearchable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-semibold">{row.email || "N/A"}</p>
        </div>
      ),
    },
    {
      name: "Package",
      field: "package",
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-semibold">
            {row.package && typeof row.package === "object"
              ? row.package.name
              : row.package || "No Package"}
          </p>
        </div>
      ),
    },
    {
      name: "Credits",
      field: "credits",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold">{cell?.toString() || "0"}</span>
      ),
    },
    {
      name: "Type",
      field: "type",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            cell === "paid"
              ? "bg-purple-100 text-purple-800"
              : "bg-gray-100 text-gray-800",
          )}
        >
          {cell?.toString().toUpperCase() || "FREE"}
        </span>
      ),
    },
    {
      name: "Expires At",
      field: "expires_at",
      isSortable: true,
      cell: ({ cell }) => {
        if (!cell) return <span className="text-sm">Never</span>;
        const date = new Date(cell.toString());
        const isExpired = date < new Date();
        return (
          <span
            className={cn(
              "text-sm",
              isExpired ? "text-red-600" : "text-green-600",
            )}
          >
            {date.toLocaleDateString()}
            {isExpired && " (Expired)"}
          </span>
        );
      },
    },
    {
      style: { width: "100px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            asChild={true}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Link
              to={`/user-wallets/${row._id}`}
              state={{
                wallet: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  {
                    name: `Wallet ${row._id}`,
                    path: `/user-wallets/${row._id}`,
                  },
                ],
              }}
            >
              <Eye className="size-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <DataTable
        status={isLoading ? "loading" : isError ? "error" : "success"}
        columns={columns}
        data={data || []}
        state={state}
        config={{
          isSearchProcessed: true,
          isSortProcessed: true,
          isPaginationProcessed: true,
        }}
      />
    </div>
  );
};

export default UserWalletsDataTableSection;
