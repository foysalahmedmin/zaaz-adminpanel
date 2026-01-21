import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import type { TAiModel } from "@/types/ai-model.type";
import { Clock, Edit, Eye, Trash } from "lucide-react";
import React from "react";

type AiModelsDataTableSectionProps = {
  data?: TAiModel[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (model: TAiModel) => void;
  onDelete: (model: TAiModel) => void;
  onHistory: (model: TAiModel) => void;
  onView: (model: TAiModel) => void;
  onToggleInitial: (model: TAiModel, is_initial: boolean) => void;
  state?: TState;
};

const AiModelsDataTableSection: React.FC<AiModelsDataTableSectionProps> = ({
  data = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onHistory,
  onView,
  onToggleInitial,
  state,
}) => {
  const columns: TColumn<TAiModel>[] = [
    {
      name: "Name",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => <span className="font-bold">{row.name}</span>,
    },
    {
      name: "Value",
      field: "value",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <span className="bg-muted text-muted-foreground rounded px-2 py-1 text-xs font-bold uppercase">
          {row.value}
        </span>
      ),
    },
    {
      name: "Provider",
      field: "provider",
      isSortable: true,
      cell: ({ row }) => row.provider,
    },
    {
      name: "Input Price ($)",
      field: "input_token_price",
      cell: ({ row }) => `$${row.input_token_price}`,
    },
    {
      name: "Output Price ($)",
      field: "output_token_price",
      cell: ({ row }) => `$${row.output_token_price}`,
    },
    {
      name: "Status",
      field: "is_active",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            cell ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}
        >
          {cell ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Initial",
      field: "is_initial",
      isSortable: true,
      cell: ({ row }) => (
        <Switch
          checked={row.is_initial || false}
          onChange={(checked) => onToggleInitial?.(row, checked)}
          disabled={!onToggleInitial}
        />
      ),
    },
    {
      style: { width: "100px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            onClick={() => onHistory(row)}
            size={"sm"}
            variant="outline"
            shape={"icon"}
            title="View History"
          >
            <Clock className="size-4" />
          </Button>
          <Button
            onClick={() => onView(row)}
            size={"sm"}
            variant="outline"
            shape={"icon"}
            title="View Details"
          >
            <Eye className="size-4" />
          </Button>
          <Button
            onClick={() => onEdit(row)}
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Edit className="size-4" />
          </Button>
          <Button
            onClick={() => onDelete(row)}
            className="[--accent:red]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Trash className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
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
  );
};

export default AiModelsDataTableSection;
