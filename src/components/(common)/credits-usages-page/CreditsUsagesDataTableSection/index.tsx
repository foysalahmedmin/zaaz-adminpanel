import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import type { TCreditsUsage } from "@/types/credits-usage.type";
import { Eye } from "lucide-react";
import React from "react";

type TCreditsUsagesDataTableSectionProps = {
  data?: TCreditsUsage[];
  isLoading: boolean;
  isError: boolean;
  onView: (row: TCreditsUsage) => void;
  state?: TState;
};

const CreditsUsagesDataTableSection: React.FC<
  TCreditsUsagesDataTableSectionProps
> = ({ data = [], isLoading, isError, onView, state }) => {
  const columns: TColumn<TCreditsUsage>[] = [
    {
      name: "Usage Key",
      field: "usage_key",
      isSearchable: true,
      cell: ({ cell }) => (
        <span className="bg-muted inline-block rounded-md px-2 py-0.5 font-mono text-xs font-medium">
          {cell?.toString() || "N/A"}
        </span>
      ),
    },
    {
      name: "Model",
      field: "ai_model",
      isSearchable: true,
      cell: ({ cell }) => (
        <Badge className="bg-blue-100 text-blue-800 capitalize">
          {cell?.toString() || "N/A"}
        </Badge>
      ),
    },
    {
      name: "User/Email",
      field: "email",
      isSearchable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="text-sm font-medium">{row.email || "N/A"}</p>
          <p className="text-muted-foreground text-[10px]">
            ID: {row.user?.substring(0, 10)}...
          </p>
        </div>
      ),
    },
    {
      name: "Tokens (I/O)",
      field: "input_tokens",
      cell: ({ row }) => (
        <div className="space-y-0.5 text-[10px]">
          <p>
            In: <span className="font-medium">{row.input_tokens || 0}</span>
          </p>
          <p>
            Out: <span className="font-medium">{row.output_tokens || 0}</span>
          </p>
        </div>
      ),
    },
    {
      name: "Credits",
      field: "credits",
      cell: ({ row }) => {
        return (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-red-600">
              {row.credits?.toFixed(4) || 0} credits
            </p>
          </div>
        );
      },
    },
    {
      name: "Profit/Extra",
      field: "profit_credits",
      cell: ({ row }) => (
        <div className="space-y-0.5 text-[10px]">
          <p className="text-green-600">
            P: <span className="font-medium">{row.profit_credits || 0}</span>
          </p>
          <p className="text-blue-600">
            R: <span className="font-medium">{row.rounding_credits || 0}</span>
          </p>
        </div>
      ),
    },
    {
      name: "Created At",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-xs">
          {cell ? new Date(cell.toString()).toLocaleString() : "N/A"}
        </span>
      ),
    },
    {
      style: { width: "80px", textAlign: "center" },
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
        columns={columns as TColumn<any>[]}
        data={data}
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

export default CreditsUsagesDataTableSection;
