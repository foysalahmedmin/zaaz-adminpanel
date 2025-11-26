import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import type { TPackage } from "@/types/package.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type PackagesDataTableSectionProps = {
  data?: TPackage[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TPackage) => void;
  onDelete: (row: TPackage) => void;
};

const PackagesDataTableSection: React.FC<PackagesDataTableSectionProps> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  onEdit,
  onDelete,
}) => {
  const columns: TColumn<TPackage>[] = [
    {
      name: "Name",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold">{row.name}</h3>
              {row.badge && (
                <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-medium">
                  {row.badge}
                </span>
              )}
              {row.type && (
                <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs">
                  {row.type}
                </span>
              )}
            </div>
            {row.description && (
              <p className="text-muted-foreground text-sm">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Plans",
      field: "plans",
      cell: ({ row }) => {
        const planCount = row.plans?.length || 0;
        return (
          <span className="font-semibold">
            {planCount} {planCount === 1 ? "plan" : "plans"}
          </span>
        );
      },
    },
    {
      name: "Initial Price",
      field: "plans",
      cell: ({ row }) => {
        const initialPlan = row.plans?.find((pp: any) => pp.is_initial) || row.plans?.[0];
        if (!initialPlan) return <span className="text-muted-foreground">N/A</span>;
        return (
          <div className="text-sm">
            <div className="font-semibold">${initialPlan.price?.USD || 0}</div>
            <div className="text-muted-foreground text-xs">
              ৳{initialPlan.price?.BDT || 0}
            </div>
          </div>
        );
      },
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
            asChild={true}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Link
              to={`/packages/${row._id}`}
              state={{
                package: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.name, path: `/packages/${row._id}` },
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
        config={{
          isSearchProcessed: false,
          isSortProcessed: false,
          isPaginationProcessed: false,
        }}
      />
    </div>
  );
};

export default PackagesDataTableSection;

