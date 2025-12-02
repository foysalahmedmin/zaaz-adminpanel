import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TPackagePlan } from "@/types/package-plan.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";

type PackagePlansDataTableSectionProps = {
  data?: TPackagePlan[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TPackagePlan) => void;
  onDelete: (row: TPackagePlan) => void;
  onView?: (row: TPackagePlan) => void;
};

const PackagePlansDataTableSection: React.FC<
  PackagePlansDataTableSectionProps
> = ({ data = [], isLoading, isError, onEdit, onDelete, onView }) => {
  const columns: TColumn<TPackagePlan>[] = [
    {
      name: "Package",
      field: "package",
      isSortable: true,
      cell: ({ row }) => {
        const packageName: string =
          typeof row.package === "object" &&
          row.package &&
          "name" in row.package
            ? String(row.package.name)
            : typeof row.package === "string"
              ? row.package
              : "N/A";
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="text-base font-bold">{packageName}</h3>
            </div>
          </div>
        );
      },
    },
    {
      name: "Plan",
      field: "plan",
      isSortable: true,
      cell: ({ row }) => {
        const planName =
          typeof row.plan === "object" && row.plan?.name
            ? row.plan.name
            : typeof row.plan === "string"
              ? row.plan
              : "N/A";
        const planDuration =
          typeof row.plan === "object" && row.plan?.duration
            ? row.plan.duration
            : null;
        return (
          <div className="space-y-1">
            <p className="font-semibold">{planName}</p>
            {planDuration && (
              <p className="text-muted-foreground text-xs">
                {planDuration} days
              </p>
            )}
          </div>
        );
      },
    },
    {
      name: "Price",
      field: "price",
      isSortable: false,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-semibold">${row.price?.USD || 0}</p>
          <p className="text-muted-foreground text-xs">
            ৳{row.price?.BDT || 0}
          </p>
        </div>
      ),
    },
    {
      name: "Token",
      field: "token",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold">{cell?.toString() || "0"}</span>
      ),
    },
    {
      name: "Initial",
      field: "is_initial",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            cell ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800",
          )}
        >
          {cell ? "Yes" : "No"}
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
          {onView && (
            <Button
              onClick={() => onView(row)}
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
      />
    </div>
  );
};

export default PackagePlansDataTableSection;
