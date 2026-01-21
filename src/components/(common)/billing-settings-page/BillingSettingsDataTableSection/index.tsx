import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";
import type { TBillingSetting } from "@/types/billing-setting.type";
import { Clock, Edit, Eye, Trash } from "lucide-react";
import React from "react";

type BillingSettingsDataTableSectionProps = {
  data?: TBillingSetting[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (setting: TBillingSetting) => void;
  onDelete: (setting: TBillingSetting) => void;
  onHistory: (setting: TBillingSetting) => void;
  onView: (setting: TBillingSetting) => void;
  onToggleInitial: (setting: TBillingSetting, is_initial: boolean) => void;
  state?: TState;
};

const BillingSettingsDataTableSection: React.FC<
  BillingSettingsDataTableSectionProps
> = ({
  data = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  onHistory,
  onView,
  onToggleInitial,
  state,
}) => {
  const columns: TColumn<TBillingSetting>[] = [
    {
      name: "Credit Price (USD)",
      field: "credit_price",
      isSortable: true,
      cell: ({ row }) => <span className="font-bold">${row.credit_price}</span>,
    },
    {
      name: "Currency",
      field: "currency",
      isSortable: true,
      cell: ({ row }) => row.currency,
    },
    {
      name: "Applied At",
      field: "applied_at",
      isSortable: true,
      cell: ({ row }) => (
        <span>
          {row.applied_at
            ? new Date(row.applied_at).toLocaleDateString()
            : "N/A"}
        </span>
      ),
    },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      cell: ({ row }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800",
          )}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      name: "Is Active",
      field: "is_active",
      isSortable: true,
      cell: ({ row }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            row.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800",
          )}
        >
          {row.is_active ? "Yes" : "No"}
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
      style: { width: "100px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            onClick={() => onHistory(row)}
            size={"sm"}
            variant="outline"
            shape={"icon"}
            title="View History"
          >
            <Clock className="size-4" />
          </Button>
          <Button
            onClick={() => onView(row)}
            size={"sm"}
            variant="outline"
            shape={"icon"}
            title="View Details"
          >
            <Eye className="size-4" />
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
  );
};

export default BillingSettingsDataTableSection;
