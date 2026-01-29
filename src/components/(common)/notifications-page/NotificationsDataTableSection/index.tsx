import DataTable from "@/components/ui/DataTable";
import { cn } from "@/lib/utils";
import type { TNotificationRecipient } from "@/types/notification-recipient";
import { formatDistanceToNow } from "date-fns";
import { Check, Eye, Trash2 } from "lucide-react";
import React from "react";

interface NotificationsDataTableSectionProps {
  data: TNotificationRecipient[];
  isLoading: boolean;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (notification: TNotificationRecipient) => void;
  state: {
    page: number;
    limit: number;
    total: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
  };
}

const NotificationsDataTableSection: React.FC<
  NotificationsDataTableSectionProps
> = ({ data, isLoading, onRead, onDelete, onView, state }) => {
  return (
    <DataTable<TNotificationRecipient>
      columns={[
        {
          name: "Notification",
          field: "notification" as keyof TNotificationRecipient,
          cell: ({ row }) => (
            <div className="flex min-w-[200px] flex-col gap-1">
              <span
                className={cn(
                  "font-medium",
                  !row.is_read ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {row.notification?.title}
              </span>
              <span className="text-muted-foreground line-clamp-1 text-xs">
                {row.notification?.message}
              </span>
            </div>
          ),
        },
        {
          name: "Type",
          field: "notification" as keyof TNotificationRecipient,
          cell: ({ row }) => (
            <span className="bg-muted rounded px-2 py-0.5 text-[10px] font-medium capitalize">
              {row.notification?.type}
            </span>
          ),
        },
        {
          name: "Status",
          field: "is_read",
          cell: ({ row }) => (
            <span
              className={cn(
                "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
                row.is_read
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600",
              )}
            >
              {row.is_read ? "Read" : "Unread"}
            </span>
          ),
        },
        {
          name: "Received",
          field: "created_at",
          cell: ({ row }) => (
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(row.created_at), {
                addSuffix: true,
              })}
            </span>
          ),
        },
        {
          name: "Actions",
          field: "_id",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onView(row)}
                className="hover:bg-primary/10 text-primary rounded p-1.5 transition-colors"
                title="View Details"
              >
                <Eye className="size-4" />
              </button>
              {!row.is_read && (
                <button
                  onClick={() => onRead(row._id)}
                  className="rounded p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
                  title="Mark as Read"
                >
                  <Check className="size-4" />
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

export default NotificationsDataTableSection;
