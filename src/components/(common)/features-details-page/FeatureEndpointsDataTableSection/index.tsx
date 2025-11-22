import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import { Edit, Trash } from "lucide-react";
import React from "react";

type FeatureEndpointsDataTableSectionProps = {
  data?: TFeatureEndpoint[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TFeatureEndpoint) => void;
  onDelete: (row: TFeatureEndpoint) => void;
};

const FeatureEndpointsDataTableSection: React.FC<
  FeatureEndpointsDataTableSectionProps
> = ({ data = [], isLoading, isError, onEdit, onDelete }) => {
  const columns: TColumn<TFeatureEndpoint>[] = [
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
              <p className="text-muted-foreground text-sm">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Endpoint",
      field: "endpoint",
      isSortable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <Badge className="bg-blue-100 text-blue-800">{row.method}</Badge>
          <p className="font-mono text-sm">{row.endpoint}</p>
        </div>
      ),
    },
    {
      name: "Token Cost",
      field: "token",
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

export default FeatureEndpointsDataTableSection;
