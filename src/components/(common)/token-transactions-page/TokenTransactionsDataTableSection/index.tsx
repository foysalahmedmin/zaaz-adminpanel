import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import { Eye } from "lucide-react";
import React from "react";

type TokenTransactionsDataTableSectionProps = {
  data?: TTokenTransaction[];
  isLoading: boolean;
  isError: boolean;
  onView: (row: TTokenTransaction) => void;
};

const TokenTransactionsDataTableSection: React.FC<
  TokenTransactionsDataTableSectionProps
> = ({
  data = [],
  isLoading,
  isError,
  onView,
}) => {
  const columns: TColumn<TTokenTransaction>[] = [
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
      name: "Token",
      field: "token",
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
            {cell?.toString() || "0"} tokens
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
          {cell
            ? new Date(cell.toString()).toLocaleDateString()
            : "N/A"}
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
        config={{
          isSearchProcessed: false,
          isSortProcessed: false,
          isPaginationProcessed: false,
        }}
      />
    </div>
  );
};

export default TokenTransactionsDataTableSection;

