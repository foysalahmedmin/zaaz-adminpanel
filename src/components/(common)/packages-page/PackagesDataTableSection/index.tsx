import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import type { TPackage } from "@/types/package.type";
import type { TBreadcrumbs } from "@/types/route-menu.type";
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
  onToggleInitial?: (row: TPackage, is_initial: boolean) => void;
  state?: TState;
};

const PackagesDataTableSection: React.FC<PackagesDataTableSectionProps> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  onEdit,
  onDelete,
  onToggleInitial,
  state,
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
      name: "Plan Prices",
      field: "plans",
      cell: ({ row }) => {
        if (!row.plans || row.plans.length === 0)
          return <span className="text-muted-foreground">No plans</span>;
        return (
          <div className="flex flex-col gap-2">
            {row.plans.map((plan: any) => (
              <div
                key={plan._id}
                className="border-muted-foreground/10 border-b pb-1 last:border-0 last:pb-0"
              >
                <p className="text-[10px] font-bold tracking-tighter uppercase">
                  {plan.plan?.name || "Unnamed Plan"}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground font-bold">
                    ${plan.price?.USD || 0}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground font-semibold">
                    ৳{plan.price?.BDT || 0}
                  </span>
                </div>
              </div>
            ))}
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

export default PackagesDataTableSection;
