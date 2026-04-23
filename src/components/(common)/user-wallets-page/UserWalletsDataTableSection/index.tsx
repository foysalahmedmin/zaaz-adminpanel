import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import type { TUserWallet } from "@/types/user-wallet.type";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type UserWalletsDataTableSectionProps = {
  data?: TUserWallet[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  state?: TState;
};

const UserWalletsDataTableSection: React.FC<UserWalletsDataTableSectionProps> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  state,
}) => {
  const columns: TColumn<TUserWallet>[] = [
    {
      name: "Email / User",
      field: "email",
      isSearchable: true,
      isSortable: true,
      cell: ({ row }) => (
        <div className="space-y-0.5">
          <p className="font-semibold">{row.email || "N/A"}</p>
          <p className="text-muted-foreground bg-muted inline-block rounded px-1.5 py-0.5 font-mono text-xs">
            {row.user}
          </p>
        </div>
      ),
    },
    {
      name: "Credits",
      field: "credits",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-lg font-bold">{cell?.toString() ?? "0"}</span>
      ),
    },
    {
      name: "Initial Credits",
      field: "initial_credits_given",
      cell: ({ cell }) =>
        cell ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="text-muted-foreground h-4 w-4" />
        ),
    },
    {
      name: "Initial Package",
      field: "initial_package_given",
      cell: ({ cell }) =>
        cell ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="text-muted-foreground h-4 w-4" />
        ),
    },
    {
      name: "Created",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-sm">
          {cell ? new Date(cell.toString()).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      style: { width: "80px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center">
          <Button asChild size="sm" variant="outline" shape="icon">
            <Link
              to={`/user-wallets/${row._id}`}
              state={{
                wallet: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: `Wallet ${row._id}`, path: `/user-wallets/${row._id}` },
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
    <DataTable
      status={isLoading ? "loading" : isError ? "error" : "success"}
      columns={columns}
      data={data}
      state={state}
      config={{ isSearchProcessed: true, isSortProcessed: true, isPaginationProcessed: true }}
    />
  );
};

export default UserWalletsDataTableSection;
