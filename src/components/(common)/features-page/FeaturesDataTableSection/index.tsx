import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TFeature } from "@/types/feature.type";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type FeaturesDataTableSectionProps = {
  data?: TFeature[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TFeature) => void;
  onDelete: (row: TFeature) => void;
  state?: TState;
};

const FeaturesDataTableSection: React.FC<FeaturesDataTableSectionProps> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  onEdit,
  onDelete,
  state,
}) => {
  const columns: TColumn<TFeature>[] = [
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
      name: "Type",
      field: "type",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="capitalize">{cell?.toString() || "N/A"}</span>
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
      name: "Max Word (Free)",
      field: "max_word",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.max_word?.free?.toLocaleString() || "0"}
        </span>
      ),
    },
    {
      name: "Max Word (Paid)",
      field: "max_word",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.max_word?.paid?.toLocaleString() || "0"}
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
            asChild={true}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Link
              to={`/features/${row._id}`}
              state={{
                feature: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.name, path: `/features/${row._id}` },
                ],
              }}
            >
              <Eye className="size-4" />
            </Link>
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

export default FeaturesDataTableSection;
