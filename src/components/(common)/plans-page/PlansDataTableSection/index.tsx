import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TPlan } from "@/types/plan.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";

type PlansDataTableSectionProps = {
  data?: TPlan[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TPlan) => void;
  onDelete: (row: TPlan) => void;
  onView?: (row: TPlan) => void;
  state?: TState;
};

const PlansDataTableSection: React.FC<PlansDataTableSectionProps> = ({
  data = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onView,
  state,
}) => {
  const columns: TColumn<TPlan>[] = [
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
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {row.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Duration (Days)",
      field: "duration",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold">{cell?.toString() || "0"}</span>
      ),
    },
    {
      name: "Sequence",
      field: "sequence",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold">{cell?.toString() || "0"}</span>
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
            cell ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}
        >
          {cell ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      style: { width: onView ? "180px" : "150px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          {onView && (
            <Button
              onClick={() => onView(row)}
              className="[--accent:green]"
              size={"sm"}
              variant="outline"
              shape={"icon"}
            >
              <Eye className="size-4" />
            </Button>
          )}
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
        config={{
          isSearchProcessed: false,
          isSortProcessed: false,
          isPaginationProcessed: false,
        }}
        state={state}
      />
    </div>
  );
};

export default PlansDataTableSection;
