import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import useAlert from "@/hooks/ui/useAlert";
import type { TFeature } from "@/types/feature.type";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import type { TPackage } from "@/types/package.type";
import type { TTokenProfit } from "@/types/token-profit.type";
import type { TUser } from "@/types/user.type";
import { RotateCcw, Trash2 } from "lucide-react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { ErrorResponse } from "@/types/response.type";
import {
  restoreFeature,
  deleteFeaturePermanent,
} from "@/services/feature.service";
import {
  restoreFeatureEndpoint,
  deleteFeatureEndpointPermanent,
} from "@/services/feature-endpoint.service";
import { restorePackage, deletePackagePermanent } from "@/services/package.service";
import {
  restoreTokenProfit,
  deleteTokenProfitPermanent,
} from "@/services/token-profit.service";
import { restoreUser, deleteUserPermanent } from "@/services/user.service";

type DeletedItemType = "feature" | "feature-endpoint" | "package" | "token-profit" | "user";

type RecycleBinTabsSectionProps = {
  type: DeletedItemType;
  data: (TFeature | TFeatureEndpoint | TPackage | TTokenProfit | TUser)[];
  meta?: { total?: number; page?: number; limit?: number };
  isLoading: boolean;
  isError: boolean;
  state: TState;
};

const RecycleBinTabsSection: React.FC<RecycleBinTabsSectionProps> = ({
  type,
  data,
  isLoading,
  isError,
  state,
}) => {
  const queryClient = useQueryClient();
  const confirm = useAlert();

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      switch (type) {
        case "feature":
          return restoreFeature(id);
        case "feature-endpoint":
          return restoreFeatureEndpoint(id);
        case "package":
          return restorePackage(id);
        case "token-profit":
          return restoreTokenProfit(id);
        case "user":
          return restoreUser(id);
        default:
          throw new Error("Invalid type");
      }
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Item restored successfully!");
      queryClient.invalidateQueries({ queryKey: [type === "feature-endpoint" ? "feature-endpoints" : `${type}s`, "deleted"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to restore item");
    },
  });

  // Permanent delete mutation
  const deletePermanentMutation = useMutation({
    mutationFn: async (id: string) => {
      switch (type) {
        case "feature":
          return deleteFeaturePermanent(id);
        case "feature-endpoint":
          return deleteFeatureEndpointPermanent(id);
        case "package":
          return deletePackagePermanent(id);
        case "token-profit":
          return deleteTokenProfitPermanent(id);
        case "user":
          return deleteUserPermanent(id);
        default:
          throw new Error("Invalid type");
      }
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Item permanently deleted!");
      queryClient.invalidateQueries({ queryKey: [type === "feature-endpoint" ? "feature-endpoints" : `${type}s`, "deleted"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete item");
    },
  });

  const onRestore = async (item: any) => {
    const ok = await confirm({
      title: "Restore Item",
      message: `Are you sure you want to restore this ${type}?`,
      confirmText: "Restore",
      cancelText: "Cancel",
    });
    if (ok) {
      restoreMutation.mutate(item._id);
    }
  };

  const onDeletePermanent = async (item: any) => {
    const ok = await confirm({
      title: "Permanently Delete",
      message: `Are you sure you want to permanently delete this ${type}? This action cannot be undone!`,
      confirmText: "Delete Permanently",
      cancelText: "Cancel",
    });
    if (ok) {
      deletePermanentMutation.mutate(item._id);
    }
  };

  // Define columns based on type
  const getColumns = (): TColumn<any>[] => {
    const baseColumns: TColumn<any>[] = [
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
                <p className="text-muted-foreground text-sm line-clamp-1">
                  {row.description}
                </p>
              )}
            </div>
          </div>
        ),
      },
      {
        name: "Deleted At",
        field: "updated_at",
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
        style: { width: "200px", textAlign: "center" },
        name: "Actions",
        field: "_id",
        cell: ({ row }) => (
          <div className="flex w-full items-center justify-center gap-2">
            <Button
              onClick={() => onRestore(row)}
              className="[--accent:green]"
              size={"sm"}
              variant="outline"
              disabled={restoreMutation.isPending || deletePermanentMutation.isPending}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restore
            </Button>
            <Button
              onClick={() => onDeletePermanent(row)}
              className="[--accent:red]"
              size={"sm"}
              variant="outline"
              disabled={restoreMutation.isPending || deletePermanentMutation.isPending}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        ),
      },
    ];

    // Add type-specific columns
    if (type === "feature") {
      return [
        ...baseColumns.slice(0, 1),
        {
          name: "Type",
          field: "type",
          isSortable: true,
          cell: ({ cell }) => (
            <span className="capitalize">{cell?.toString() || "N/A"}</span>
          ),
        },
        ...baseColumns.slice(1),
      ];
    }

    if (type === "package") {
      return [
        ...baseColumns.slice(0, 1),
        {
          name: "Tokens",
          field: "token",
          isSortable: true,
          cell: ({ cell }) => (
            <span className="font-semibold">{cell?.toString() || "0"}</span>
          ),
        },
        ...baseColumns.slice(1),
      ];
    }

    if (type === "token-profit") {
      return [
        ...baseColumns.slice(0, 1),
        {
          name: "Percentage",
          field: "percentage",
          isSortable: true,
          cell: ({ cell }) => (
            <span className="font-semibold">{cell?.toString() || "0"}%</span>
          ),
        },
        ...baseColumns.slice(1),
      ];
    }

    if (type === "user") {
      return [
        {
          name: "Email",
          field: "email",
          isSortable: true,
          isSearchable: true,
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold">{row.name}</h3>
                <p className="text-muted-foreground text-sm">{row.email}</p>
              </div>
            </div>
          ),
        },
        {
          name: "Role",
          field: "role",
          isSortable: true,
          cell: ({ cell }) => (
            <span className="capitalize">{cell?.toString() || "N/A"}</span>
          ),
        },
        ...baseColumns.slice(1),
      ];
    }

    return baseColumns;
  };

  return (
    <div className="mt-4">
      <DataTable
        status={isLoading ? "loading" : isError ? "error" : "success"}
        columns={getColumns()}
        data={data || []}
        config={{
          isSearchProcessed: false,
          isSortProcessed: false,
          isPaginationProcessed: false,
        }}
        state={state}
      />
    </div>
  );
};

export default RecycleBinTabsSection;

