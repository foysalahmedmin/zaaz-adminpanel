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
            <h3 className="text-base font-bold">{row.name}</h3>
            {row.description && (
              <p className="text-muted-foreground text-sm">{row.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Tokens",
      field: "token",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold">{cell?.toString() || "0"}</span>
      ),
    },
    {
      name: "Price (USD)",
      field: "price",
      cell: ({ row }) => (
        <span className="font-semibold">${row.price?.USD || 0}</span>
      ),
    },
    {
      name: "Price (BDT)",
      field: "price",
      cell: ({ row }) => (
        <span className="font-semibold">৳{row.price?.BDT || 0}</span>
      ),
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

