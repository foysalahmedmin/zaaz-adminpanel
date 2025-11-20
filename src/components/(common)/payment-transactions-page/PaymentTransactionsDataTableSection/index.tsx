import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import { Eye } from "lucide-react";
import React from "react";

type PaymentTransactionsDataTableSectionProps = {
  data?: TPaymentTransaction[];
  isLoading: boolean;
  isError: boolean;
  onView: (row: TPaymentTransaction) => void;
};

const PaymentTransactionsDataTableSection: React.FC<
  PaymentTransactionsDataTableSectionProps
> = ({
  data = [],
  isLoading,
  isError,
  onView,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: TColumn<TPaymentTransaction>[] = [
    {
      name: "Transaction ID",
      field: "gateway_transaction_id",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-mono text-sm">{row.gateway_transaction_id}</p>
          {row.gateway_session_id && (
            <p className="text-muted-foreground text-xs">
              Session: {row.gateway_session_id.substring(0, 20)}...
            </p>
          )}
        </div>
      ),
    },
    {
      name: "Amount",
      field: "amount",
      isSortable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-semibold">
            {row.currency === "USD" ? "$" : "৳"}
            {row.amount}
          </p>
          <p className="text-muted-foreground text-xs">{row.currency}</p>
        </div>
      ),
    },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium capitalize",
            getStatusColor(cell?.toString() || ""),
          )}
        >
          {cell?.toString()}
        </span>
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

export default PaymentTransactionsDataTableSection;

