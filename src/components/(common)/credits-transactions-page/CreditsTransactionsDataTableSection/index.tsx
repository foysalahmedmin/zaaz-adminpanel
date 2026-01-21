import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TCreditsTransaction } from "@/types/credits-transaction.type";
import { Eye } from "lucide-react";
import React from "react";

type TCreditsTransactionsDataTableSectionProps = {
  data?: TCreditsTransaction[];
  isLoading: boolean;
  isError: boolean;
  onView: (row: TCreditsTransaction) => void;
  state?: TState;
};

const CreditsTransactionsDataTableSection: React.FC<
  TCreditsTransactionsDataTableSectionProps
> = ({ data = [], isLoading, isError, onView, state }) => {
  const columns: TColumn<TCreditsTransaction>[] = [
    {
      name: "Doc ID",
      field: "_id",
      cell: ({ row }) => (
        <span className="bg-muted inline-block rounded-md px-2 py-0.5 font-mono text-xs font-medium">
          {row._id?.substring(0, 8)}...
        </span>
      ),
    },
    {
      name: "Type",
      field: "type",
      isSortable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge
            className={cn(
              "text-xs",
              row.type === "increase"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800",
            )}
          >
            {row.type === "increase" ? "↑ Increase" : "↓ Decrease"}
          </Badge>
          {row.type === "increase" && row.increase_source && (
            <p className="text-muted-foreground text-xs capitalize">
              Source: {row.increase_source}
            </p>
          )}
        </div>
      ),
    },
    {
      name: "Email/User",
      field: "email",
      isSearchable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium">{row.email || "N/A"}</p>
          <p className="text-muted-foreground text-xs">
            ID: {row.user?.substring(0, 10)}...
          </p>
        </div>
      ),
    },
    {
      name: "Credits",
      field: "credits",
      isSortable: true,
      cell: ({ cell, row }) => (
        <div className="space-y-1">
          <p
            className={cn(
              "font-semibold",
              row.type === "increase" ? "text-green-600" : "text-red-600",
            )}
          >
            {row.type === "increase" ? "+" : "-"}
            {cell?.toString() || "0"} credits
          </p>
        </div>
      ),
    },
    {
      name: "Created At",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-sm">
          {cell ? new Date(cell.toString()).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      style: { width: "100px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            onClick={() => onView(row)}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Eye className="size-4" />
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

export default CreditsTransactionsDataTableSection;
