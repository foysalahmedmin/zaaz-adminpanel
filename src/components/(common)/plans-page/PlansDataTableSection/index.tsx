import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
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
};

const PlansDataTableSection: React.FC<PlansDataTableSectionProps> = ({
  data = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
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
      style: { width: "150px", textAlign: "center" },
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
        config={{
          isSearchProcessed: false,
          isSortProcessed: false,
          isPaginationProcessed: false,
        }}
      />
    </div>
  );
};

export default PlansDataTableSection;

