import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { closeHistoryModal } from "@/redux/slices/billing-settings-page-slice";
import type { RootState } from "@/redux/store";
import { fetchBillingSettingHistories } from "@/services/billing-setting-history.service";
import type { TBillingSettingHistory } from "@/types/billing-setting-history.type";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const BillingSettingHistoryModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isHistoryModalOpen, selectedBillingSetting } = useSelector(
    (state: RootState) => state.billingSettingsPage,
  );

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("-created_at");

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "billing-setting-histories",
      selectedBillingSetting?._id,
      { page, limit, sort },
    ],
    queryFn: () =>
      fetchBillingSettingHistories(selectedBillingSetting?._id as string, {
        page,
        limit,
        sort,
      }),
    enabled: !!selectedBillingSetting && isHistoryModalOpen,
  });

  const columns: TColumn<TBillingSettingHistory>[] = [
    {
      name: "Update Date",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-sm">
          {new Date(cell?.toString() || "").toLocaleString()}
        </span>
      ),
    },
    {
      name: "Credit Price",
      field: "credit_price",
      isSortable: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">${row.credit_price}</span>
          <span className="text-muted-foreground text-xs">{row.currency}</span>
        </div>
      ),
    },
    {
      name: "Status",
      field: "is_active",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span
            className={`w-fit rounded-full px-2 py-0.5 text-[10px] ${
              row.is_active
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {row.is_active ? "Active" : "Inactive"}
          </span>
          {row.is_initial && (
            <span className="bg-primary/10 text-primary w-fit rounded-full px-2 py-0.5 text-[10px]">
              Initial
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isHistoryModalOpen}
      setIsOpen={() => dispatch(closeHistoryModal())}
    >
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <Modal.Header>
            <Modal.Title>History</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <Modal.Body>
            <DataTable
              status={isLoading ? "loading" : isError ? "error" : "success"}
              columns={columns}
              data={data?.data || []}
              state={{
                total: data?.meta?.total || 0,
                page: data?.meta?.page || 0,
                limit: data?.meta?.limit || 10,
                setPage,
                setLimit,
                setSort,
                sort,
              }}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default BillingSettingHistoryModal;
