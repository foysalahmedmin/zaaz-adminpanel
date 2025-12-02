import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import { Edit, Eye, Trash } from "lucide-react";
import React from "react";

type FeatureEndpointsDataTableSectionProps = {
  data?: TFeatureEndpoint[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TFeatureEndpoint) => void;
  onDelete: (row: TFeatureEndpoint) => void;
  onView?: (row: TFeatureEndpoint) => void;
};

const FeatureEndpointsDataTableSection: React.FC<
  FeatureEndpointsDataTableSectionProps
> = ({ data = [], isLoading, isError, onEdit, onDelete, onView }) => {
  const columns: TColumn<TFeatureEndpoint>[] = [
    {
      name: "Name",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => {
        // Safely extract name
        let name = "N/A";
        if (typeof row.name === "string") {
          name = row.name;
        } else if (typeof row.name === "object" && row.name !== null) {
          const nameObj = row.name as Record<string, unknown>;
          const extractedName =
            nameObj.name || nameObj.value || nameObj.title || "";
          name =
            typeof extractedName === "string"
              ? extractedName
              : typeof extractedName === "number"
                ? extractedName.toString()
                : "N/A";
        }

        // Safely extract description
        let description: string | null = null;
        if (row.description) {
          if (typeof row.description === "string") {
            description = row.description;
          } else if (
            typeof row.description === "object" &&
            row.description !== null
          ) {
            const descObj = row.description as Record<string, unknown>;
            const extractedDesc =
              descObj.description || descObj.value || descObj.text || "";
            if (typeof extractedDesc === "string") {
              description = extractedDesc;
            } else if (typeof extractedDesc === "number") {
              description = extractedDesc.toString();
            }
          }
        }

        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="text-base font-bold">{name}</h3>
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      name: "Endpoint",
      field: "endpoint",
      isSortable: true,
      cell: ({ row }) => {
        // Safely extract method
        let method = "N/A";
        if (typeof row.method === "string") {
          method = row.method;
        } else if (typeof row.method === "object" && row.method !== null) {
          const methodObj = row.method as Record<string, unknown>;
          method =
            (methodObj.value as string) ||
            (methodObj.name as string) ||
            (methodObj.method as string) ||
            "N/A";
        }

        // Safely extract endpoint
        let endpoint = "N/A";
        if (typeof row.endpoint === "string") {
          endpoint = row.endpoint;
        } else if (typeof row.endpoint === "object" && row.endpoint !== null) {
          const endpointObj = row.endpoint as Record<string, unknown>;
          endpoint =
            (endpointObj.value as string) ||
            (endpointObj.name as string) ||
            (endpointObj.endpoint as string) ||
            "N/A";
        }

        return (
          <div className="space-y-1">
            <Badge className="bg-blue-100 text-blue-800">{method}</Badge>
            <p className="font-mono text-sm">{endpoint}</p>
          </div>
        );
      },
    },
    {
      name: "Minimum Token",
      field: "token",
      isSortable: true,
      cell: ({ cell }) => {
        // Handle if cell is an object
        if (typeof cell === "object" && cell !== null) {
          const cellObj = cell as Record<string, unknown>;
          const tokenValue =
            cellObj.token ||
            cellObj.value ||
            cellObj.amount ||
            cellObj.count ||
            0;
          return (
            <span className="font-semibold">
              {typeof tokenValue === "number"
                ? tokenValue.toString()
                : typeof tokenValue === "string"
                  ? tokenValue
                  : "0"}
            </span>
          );
        }
        return <span className="font-semibold">{cell?.toString() || "0"}</span>;
      },
    },
    {
      name: "Sequence",
      field: "sequence",
      isSortable: true,
      cell: ({ cell }) => {
        // Handle if cell is an object
        if (typeof cell === "object" && cell !== null) {
          const cellObj = cell as Record<string, unknown>;
          const sequenceValue =
            cellObj.sequence ||
            cellObj.value ||
            cellObj.order ||
            cellObj.index ||
            0;
          return (
            <span className="font-semibold">
              {typeof sequenceValue === "number"
                ? sequenceValue.toString()
                : typeof sequenceValue === "string"
                  ? sequenceValue
                  : "0"}
            </span>
          );
        }
        return <span className="font-semibold">{cell?.toString() || "0"}</span>;
      },
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
      style: { width: onView ? "180px" : "150px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          {onView && (
            <Button
              onClick={() => onView(row)}
              className="[--accent:green]"
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

export default FeatureEndpointsDataTableSection;
