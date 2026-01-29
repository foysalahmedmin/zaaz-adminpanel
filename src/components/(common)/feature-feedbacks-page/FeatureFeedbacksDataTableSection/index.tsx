import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TFeatureFeedback } from "@/types/feature-feedback.type";
import { CheckCircle2, Eye, Trash2 } from "lucide-react";
import React from "react";

interface FeatureFeedbacksDataTableSectionProps {
  data: TFeatureFeedback[];
  isLoading: boolean;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onView: (feedback: TFeatureFeedback) => void;
  state: {
    page: number;
    limit: number;
    total: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
  };
}

const FeatureFeedbacksDataTableSection: React.FC<
  FeatureFeedbacksDataTableSectionProps
> = ({ data, isLoading, onStatusUpdate, onDelete, onView, state }) => {
  return (
    <DataTable<TFeatureFeedback>
      columns={[
        {
          name: "User",
          field: "user" as keyof TFeatureFeedback,
          cell: ({ row }) => (
            <div className="flex min-w-[150px] flex-col gap-0.5">
              <span className="text-sm font-semibold">{row.user?.name}</span>
              <span className="text-muted-foreground text-xs">
                {row.user?.email}
              </span>
            </div>
          ),
        },
        {
          name: "Feature",
          field: "feature" as keyof TFeatureFeedback,
          cell: ({ row }) => (
            <span className="bg-primary/5 text-primary rounded px-2 py-1 text-xs font-medium">
              {row.feature?.name}
            </span>
          ),
        },
        {
          name: "Feedback",
          field: "comment",
          cell: ({ row }) => (
            <div className="flex max-w-[300px] flex-col gap-0.5">
              <div className="mb-1 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "size-2 rounded-full",
                      i < row.rating ? "bg-amber-400" : "bg-muted",
                    )}
                  />
                ))}
              </div>
              <p className="text-muted-foreground line-clamp-2 text-xs italic">
                "{row.comment}"
              </p>
            </div>
          ),
        },
        {
          name: "Status",
          field: "status",
          cell: ({ row }) => {
            const statusConfig: Record<string, string> = {
              pending: "bg-amber-500/10 text-amber-600",
              reviewed: "bg-blue-500/10 text-blue-600",
              resolved: "bg-emerald-500/10 text-emerald-600",
            };
            return (
              <span
                className={cn(
                  "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                  statusConfig[row.status] || "bg-muted",
                )}
              >
                {row.status}
              </span>
            );
          },
        },
        {
          name: "Actions",
          field: "_id",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(row)}
                className="hover:bg-primary/10 text-primary rounded p-1.5 transition-colors"
                title="View Full Feedback"
              >
                <Eye className="size-4" />
              </button>
              {row.status !== "resolved" && (
                <button
                  onClick={() => onStatusUpdate(row._id, "resolved")}
                  className="rounded p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
                  title="Mark as Resolved"
                >
                  <CheckCircle2 className="size-4" />
                </button>
              )}
              <button
                onClick={() => onDelete(row._id)}
                className="hover:bg-destructive/10 text-destructive rounded p-1.5 transition-colors"
                title="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ),
        },
      ]}
      data={data}
      status={isLoading ? "loading" : "success"}
      state={{
        page: state.page,
        limit: state.limit,
        total: state.total,
        setPage: state.setPage,
        setLimit: state.setLimit,
      }}
    />
  );
};

export default FeatureFeedbacksDataTableSection;
