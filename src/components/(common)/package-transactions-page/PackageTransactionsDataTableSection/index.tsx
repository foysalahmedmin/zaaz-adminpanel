import { Badge } from "@/components/ui/Badge";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import type { TPackageTransaction } from "@/services/package-transaction.service";
import { Eye, Package, Trash2 } from "lucide-react";
import React from "react";

type PackageTransactionsDataTableSectionProps = {
  data: TPackageTransaction[];
  isLoading: boolean;
  isError: boolean;
  onView: (transaction: TPackageTransaction) => void;
  onDelete?: (transaction: TPackageTransaction) => void;
  state: {
    search: string;
    sort: string;
    page: number;
    limit: number;
    total: number;
    setSearch: (value: string) => void;
    setSort: (value: string) => void;
    setPage: (value: number) => void;
    setLimit: (value: number) => void;
  };
};

const PackageTransactionsDataTableSection: React.FC<
  PackageTransactionsDataTableSectionProps
> = ({ data, isLoading, isError, onView, onDelete, state }) => {
  const columns: TColumn<TPackageTransaction>[] = [
    {
      name: "User",
      field: "email",
      cell: ({ row }) => {
        const user = row.user as any;
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {row.email || user?.email || "N/A"}
            </span>
            <span className="text-muted-foreground font-mono text-[10px]">
              {row.user_wallet}
            </span>
          </div>
        );
      },
    },
    {
      name: "Package & Plan",
      field: "package",
      cell: ({ row }) => {
        const pkg = row.package as any;
        const plan = row.plan as any;
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-sm font-bold uppercase">
              <Package className="text-primary size-3.5" />
              <span>{pkg?.name || "N/A"}</span>
            </div>
            <span className="text-muted-foreground text-xs font-medium">
              {plan?.name || "Standard Plan"}
            </span>
          </div>
        );
      },
    },
    {
      name: "Credits",
      field: "credits",
      cell: ({ row }) => (
        <span className="font-bold text-green-600">+{row.credits}</span>
      ),
    },
    {
      name: "Source",
      field: "increase_source",
      cell: ({ row }) => (
        <Badge
          className={`font-semibold capitalize ${row.increase_source === "payment" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}
        >
          {row.increase_source}
        </Badge>
      ),
    },
    {
      name: "Date",
      field: "created_at",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row)}
            className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full p-1 transition-colors"
            title="View Details"
          >
            <Eye className="size-5" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(row)}
              className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full p-1 transition-colors"
              title="Soft Delete"
            >
              <Trash2 className="size-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      status={isLoading ? "loading" : isError ? "error" : "success"}
      state={{
        search: state.search,
        sort: state.sort,
        page: state.page,
        limit: state.limit,
        total: state.total,
        setSearch: state.setSearch,
        setSort: state.setSort,
        setPage: state.setPage,
        setLimit: state.setLimit,
      }}
      config={{
        isSearchProcessed: true,
        isSortProcessed: true,
        isPaginationProcessed: true,
      }}
    />
  );
};

export default PackageTransactionsDataTableSection;
