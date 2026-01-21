import FeatureUsageLogViewModal from "@/components/modals/FeatureUsageLogViewModal";
import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TFeatureUsageLog } from "@/types/feature-usage-log.type";
import { Eye, Trash } from "lucide-react";
import React, { useState } from "react";

const getEndpointData = (row: TFeatureUsageLog) => {
  let endpoint = row.feature_endpoint;

  if (Array.isArray(endpoint) && endpoint.length > 0) {
    endpoint = endpoint[0] as any;
  }

  if (!endpoint || typeof endpoint !== "object") {
    return { endpoint: null, feature: null };
  }

  let feature = (endpoint as any).feature;
  if (Array.isArray(feature) && feature.length > 0) {
    feature = feature[0];
  }

  return { endpoint: endpoint as any, feature };
};

type FeatureUsageLogsDataTableSectionProps = {
  data?: TFeatureUsageLog[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (row: TFeatureUsageLog) => void;
  state?: TState;
};

const FeatureUsageLogsDataTableSection: React.FC<
  FeatureUsageLogsDataTableSectionProps
> = ({ data = [], isLoading, isError, onDelete, state }) => {
  const columns: TColumn<TFeatureUsageLog>[] = [
    {
      name: "Feature",
      field: "feature_endpoint",
      cell: ({ row }) => {
        const { endpoint, feature } = getEndpointData(row);

        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold uppercase">
              {(feature as any)?.name || "N/A"}
            </span>
            <span className="text-muted-foreground text-[10px] font-medium italic">
              ({endpoint?.name || "N/A"})
            </span>
          </div>
        );
      },
    },
    {
      name: "Endpoint",
      field: "feature_endpoint",
      cell: ({ row }) => {
        const { endpoint } = getEndpointData(row);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="bg-muted w-fit rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {row.method || endpoint?.method || "N/A"}
            </span>
            <span className="text-muted-foreground max-w-[200px] truncate font-mono text-[10px]">
              {row.endpoint || endpoint?.endpoint || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium capitalize",
            cell === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800",
          )}
        >
          {cell?.toString()}
        </span>
      ),
    },
    {
      name: "Code",
      field: "code",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="font-mono text-sm">{cell?.toString()}</span>
      ),
    },
    {
      name: "User",
      field: "email",
      cell: ({ row }) => (
        <span className="text-sm">{row.email || "Unknown"}</span>
      ),
    },
    {
      name: "Date",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-muted-foreground text-sm">
          {cell ? new Date(cell.toString()).toLocaleString() : "N/A"}
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
            onClick={() => onOpenViewModal(row)}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Eye className="size-4" />
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

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Partial<TFeatureUsageLog>>({});

  const onOpenViewModal = (log: TFeatureUsageLog) => {
    setSelectedLog(log);
    setIsViewModalOpen(true);
  };

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
      <FeatureUsageLogViewModal
        isOpen={isViewModalOpen}
        setIsOpen={setIsViewModalOpen}
        default={selectedLog}
      />
    </div>
  );
};

export default FeatureUsageLogsDataTableSection;
