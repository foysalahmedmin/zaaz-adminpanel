import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TCoupon } from "@/types/coupon.type";
import { Edit, Trash } from "lucide-react";
import React from "react";

type CouponsDataTableSectionProps = {
  data?: TCoupon[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TCoupon) => void;
  onDelete: (row: TCoupon) => void;
  state?: TState;
  breadcrumbs: any[]; // for interface compatibility
};

const CouponsDataTableSection: React.FC<CouponsDataTableSectionProps> = ({
  data = [],
  isLoading,
  isError,
  onEdit,
  onDelete,
  state,
}) => {
  const columns: TColumn<TCoupon>[] = [
    {
      name: "Code",
      field: "code",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <span className="bg-primary/10 text-primary hover:bg-primary/20 rounded px-2 py-1 text-sm font-bold uppercase transition-all">
          {row.code}
        </span>
      ),
    },
    {
      name: "Discount",
      field: "discount_value",
      cell: ({ row }) => {
        if (row.discount_type === "percentage") {
          return (
            <div className="flex flex-col">
              <span className="font-bold">{row.discount_value}% OFF</span>
              <span className="text-muted-foreground text-[10px]">
                Max: ${row.max_discount_amount?.USD} / ৳
                {row.max_discount_amount?.BDT}
              </span>
            </div>
          );
        }
        return (
          <div className="flex flex-col">
            <span className="font-bold">Fixed Amount</span>
            <span className="text-muted-foreground text-xs font-medium">
              ${row.fixed_amount?.USD} / ৳{row.fixed_amount?.BDT}
            </span>
          </div>
        );
      },
    },
    {
      name: "Validity",
      field: "valid_until",
      isSortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col text-xs font-medium">
          <span className="text-muted-foreground">
            From: {new Date(row.valid_from).toLocaleDateString()}
          </span>
          <span>Until: {new Date(row.valid_until).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      name: "Usage",
      field: "usage_count",
      isSortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-bold">{row.usage_count} used</span>
          <span className="text-muted-foreground text-[10px]">
            Limit: {row.usage_limit > 0 ? row.usage_limit : "Unlimited"}
          </span>
        </div>
      ),
    },
    {
      name: "Status",
      field: "is_active",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-semibold",
            cell ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}
        >
          {cell ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      style: { width: "120px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            onClick={() => onEdit(row)}
            size={"sm"}
            variant="outline"
            shape={"icon"}
            className="hover:bg-accent transition-colors"
          >
            <Edit className="size-4" />
          </Button>
          <Button
            onClick={() => onDelete(row)}
            className="text-red-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
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

export default CouponsDataTableSection;
