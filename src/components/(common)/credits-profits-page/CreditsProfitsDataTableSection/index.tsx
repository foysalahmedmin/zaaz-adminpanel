import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TCreditsProfit } from "@/types/credits-profit.type";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type CreditsProfitsDataTableSectionProps = {
  data?: TCreditsProfit[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TCreditsProfit) => void;
  onDelete: (row: TCreditsProfit) => void;
  state: {
    search: string;
    setSearch: (value: string) => void;
    sort: string;
    setSort: (value: string) => void;
    page: number;
    setPage: (value: number) => void;
    limit: number;
    setLimit: (value: number) => void;
    total: number;
  };
};

const CreditsProfitsDataTableSection: React.FC<
  CreditsProfitsDataTableSectionProps
> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  onEdit,
  onDelete,
  state,
}) => {
  const columns: TColumn<TCreditsProfit>[] = [
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
      name: "Percentage",
      field: "percentage",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold">{cell?.toString() || "0"}%</span>
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
      style: { width: "200px", textAlign: "center" },
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
              to={`/credits-profits/${row._id}`}
              state={{
                creditsProfit: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.name, path: `/credits-profits/${row._id}` },
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
          isSearchProcessed: false,
          isSortProcessed: false,
          isPaginationProcessed: false,
        }}
      />
    </div>
  );
};

export default CreditsProfitsDataTableSection;
