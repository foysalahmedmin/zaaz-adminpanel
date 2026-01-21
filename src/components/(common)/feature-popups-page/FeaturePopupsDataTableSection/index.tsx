import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TFeaturePopup } from "@/types/feature-popup.type";
import { Edit, Trash } from "lucide-react";
import React from "react";

type FeaturePopupsDataTableSectionProps = {
  data?: TFeaturePopup[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TFeaturePopup) => void;
  onDelete: (row: TFeaturePopup) => void;
  state?: TState;
};

const FeaturePopupsDataTableSection: React.FC<
  FeaturePopupsDataTableSectionProps
> = ({ data = [], isLoading, isError, onEdit, onDelete, state }) => {
  const columns: TColumn<TFeaturePopup>[] = [
    {
      name: "Name",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold">{row.name}</h3>
            {row.description && (
              <p className="text-muted-foreground text-sm line-clamp-1">
                {row.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Feature",
      field: "feature",
      isSortable: false,
      cell: ({ row }) => {
        const feature =
          typeof row.feature === "object" && row.feature !== null
            ? row.feature
            : null;
        return (
          <span className="text-sm">
            {feature?.name || (typeof row.feature === "string" ? row.feature : "N/A")}
          </span>
        );
      },
    },
    {
      name: "Category",
      field: "category",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="capitalize">{cell?.toString() || "N/A"}</span>
      ),
    },
    {
      name: "Actions Count",
      field: "actions",
      isSortable: false,
      cell: ({ row }) => (
        <span className="font-semibold">
          {row.actions?.length || 0}
        </span>
      ),
    },
    {
      name: "Status",
      field: "is_active",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            cell
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800",
          )}
        >
          {cell ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      style: { width: "120px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
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

export default FeaturePopupsDataTableSection;

