import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { TColumn, TState } from "@/components/ui/DataTable";
import DataTable from "@/components/ui/DataTable";
import { URLS } from "@/config";
import useUser from "@/hooks/states/useUser";
import { cn } from "@/lib/utils";
import type { TBreadcrumbs } from "@/types/route-menu.type";
import type { TUser } from "@/types/user.type";
import { BadgeIcon, Eye, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router";

type UsersDataTableSectionProps = {
  data?: TUser[];
  breadcrumbs: TBreadcrumbs[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (row: TUser) => void;
  onDelete: (row: TUser) => void;
  state?: TState;
  basePath?: string;
};

const UsersDataTableSection: React.FC<UsersDataTableSectionProps> = ({
  data = [],
  breadcrumbs,
  isLoading,
  isError,
  onDelete,
  state,
  basePath = "/users",
}) => {
  const { user } = useUser();
  const { info } = user || {};

  const columns: TColumn<TUser>[] = [
    {
      name: "Name",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="aspect-square h-16 flex-shrink-0 overflow-hidden rounded-full">
            {row.image ? (
              <img
                className="size-full object-cover"
                src={URLS.user + "/" + row.image}
                alt={row.name}
              />
            ) : (
              <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-xl font-bold">
                {row.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h3 className="text-base font-bold">{row.name}</h3>
            <p className="text-muted-foreground text-xs">{row.email}</p>
            <div className="flex items-center">
              <Badge className="bg-muted text-foreground flex w-fit items-center gap-2 px-2 py-1 text-xs">
                <BadgeIcon className="size-4" />
                <span className="leading-none capitalize">{row?.role}</span>
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Role",
      field: "role",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="capitalize">{cell?.toString()}</span>
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
            cell === "in-progress"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800",
          )}
        >
          {cell?.toString()}
        </span>
      ),
    },
    {
      name: "Verified",
      field: "is_verified",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium capitalize",
            cell ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}
        >
          {cell ? "Verified" : "Unverified"}
        </span>
      ),
    },
    {
      style: { width: "150px", textAlign: "center" },
      name: "Actions",
      field: "_id",
      cell: ({ row }) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            asChild={true}
            className="[--accent:green]"
            size={"sm"}
            variant="outline"
            shape={"icon"}
          >
            <Link
              to={`${basePath}/${row._id}`}
              state={{
                category: row,
                breadcrumbs: [
                  ...(breadcrumbs || []),
                  { name: row.name, path: `${basePath}/${row._id}` },
                ],
              }}
            >
              <Eye className="size-4" />
            </Link>
          </Button>
          {((info?.role === "super-admin" && row?.role !== "super-admin") ||
            (info?.role === "admin" &&
              row?.role !== "super-admin" &&
              row?.role !== "admin")) && (
            <>
              {/* <Button
                onClick={() => onEdit(row)}
                size={"sm"}
                variant="outline"
                shape={"icon"}
              >
                <Edit className="size-4" />
              </Button> */}
              <Button
                onClick={() => onDelete(row)}
                className="[--accent:red]"
                size={"sm"}
                variant="outline"
                shape={"icon"}
              >
                <Trash className="size-4" />
              </Button>
            </>
          )}
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

export default UsersDataTableSection;
