import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import type { TPackageHistory } from "@/types/package-history.type";
import { Eye } from "lucide-react";
import React from "react";

type PackageHistoriesDataTableSectionProps = {
  data?: TPackageHistory[];
  isLoading: boolean;
  isError: boolean;
  onView: (row: TPackageHistory) => void;
};

const PackageHistoriesDataTableSection: React.FC<
  PackageHistoriesDataTableSectionProps
> = ({
  data = [],
  isLoading,
  isError,
  onView,
}) => {
  const columns: TColumn<TPackageHistory>[] = [
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
      name: "Features",
      field: "features",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.features?.length || 0} feature
          {(row.features?.length || 0) !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      name: "Plans",
      field: "plans",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.plans?.length || 0} plan{(row.plans?.length || 0) !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      name: "Initial Plan",
      field: "plans",
      cell: ({ row }) => {
        const initialPlan = row.plans?.find((pp) => pp.is_initial);
        return initialPlan ? (
          <div className="space-y-1">
            <span className="font-semibold">{initialPlan.plan.name}</span>
            <div className="text-muted-foreground text-xs">
              ${initialPlan.price.USD} / ৳{initialPlan.price.BDT}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">N/A</span>
        );
      },
    },
    {
      name: "Created At",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-sm">
          {cell
            ? new Date(cell.toString()).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      style: { width: "100px", textAlign: "center" },
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

export default PackageHistoriesDataTableSection;

