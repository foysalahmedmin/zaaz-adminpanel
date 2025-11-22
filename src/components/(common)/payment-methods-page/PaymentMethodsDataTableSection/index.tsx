import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TPaymentMethod } from "@/types/payment-method.type";
import { Eye, Edit, Trash } from "lucide-react";
import React from "react";

type PaymentMethodsDataTableSectionProps = {
  data?: TPaymentMethod[];
  isLoading: boolean;
  isError: boolean;
  onView?: (row: TPaymentMethod) => void;
  onEdit: (row: TPaymentMethod) => void;
  onDelete: (row: TPaymentMethod) => void;
};

const PaymentMethodsDataTableSection: React.FC<
  PaymentMethodsDataTableSectionProps
> = ({ data = [], isLoading, isError, onView, onEdit, onDelete }) => {
  const columns: TColumn<TPaymentMethod>[] = [
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
      name: "Value",
      field: "value",
      isSortable: true,
      isSearchable: true,
      cell: ({ cell }) => (
        <span className="font-mono text-sm">{cell?.toString() || "N/A"}</span>
      ),
    },
    {
      name: "Currency",
      field: "currency",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-semibold uppercase">
          {cell?.toString() || "N/A"}
        </span>
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
      name: "Test Mode",
      field: "is_test",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            cell
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800",
          )}
        >
          {cell ? "Test" : "Live"}
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
      style: { width: onView ? "160px" : "120px", textAlign: "center" },
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

export default PaymentMethodsDataTableSection;
