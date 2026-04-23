import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import type { TColumn } from "@/components/ui/DataTable";
import useAlert from "@/hooks/ui/useAlert";
import { deleteFile, fetchFiles } from "@/services/file.service";
import type { TFile } from "@/types/file.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ExternalLink, File, FileImage, FileText, FileVideo, HardDrive, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileTypeIcon = ({ mimetype }: { mimetype: string }) => {
  if (mimetype.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-500" />;
  if (mimetype.startsWith("video/")) return <FileVideo className="h-5 w-5 text-purple-500" />;
  if (mimetype.includes("pdf") || mimetype.includes("text")) return <FileText className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

const FilesPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  const queryParams = useMemo(
    () => ({ page, limit, ...(sort && { sort }), ...(search && { search }) }),
    [page, limit, sort, search],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["files", queryParams],
    queryFn: () => fetchFiles(queryParams),
  });

  useEffect(() => {
    if (data?.meta?.total !== undefined) setTotal(data.meta.total);
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFile(id),
    onSuccess: () => {
      toast.success("File deleted");
      queryClient.invalidateQueries({ queryKey: ["files"] });
    },
    onError: (err: AxiosError<TErrorResponse>) => {
      toast.error(err.response?.data?.message || "Failed to delete file");
    },
  });

  const handleDelete = async (file: TFile) => {
    const ok = await confirm({
      title: "Delete File",
      message: `Delete "${file.name || file.originalname}"? This can be restored from the Recycle Bin.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) deleteMutation.mutate(file._id);
  };

  const columns: TColumn<TFile>[] = [
    {
      name: "File",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.url && row.mimetype?.startsWith("image/") ? (
            <img
              src={row.url}
              alt={row.name}
              className="h-10 w-10 rounded object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded">
              <FileTypeIcon mimetype={row.mimetype || ""} />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">{row.name || row.originalname}</p>
            <p className="text-muted-foreground truncate font-mono text-xs">
              {row.originalname}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Type",
      field: "mimetype",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-muted-foreground text-xs">{cell?.toString() || "N/A"}</span>
      ),
    },
    {
      name: "Size",
      field: "size",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-sm">{cell ? formatFileSize(Number(cell)) : "N/A"}</span>
      ),
    },
    {
      name: "Provider",
      field: "provider",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium uppercase text-blue-700">
          {cell?.toString() || "N/A"}
        </span>
      ),
    },
    {
      name: "Status",
      field: "status",
      isSortable: true,
      cell: ({ cell }) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
            cell === "active"
              ? "bg-green-100 text-green-700"
              : cell === "archived"
                ? "bg-gray-100 text-gray-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {cell?.toString() || "N/A"}
        </span>
      ),
    },
    {
      name: "Date",
      field: "created_at",
      isSortable: true,
      cell: ({ cell }) => (
        <span className="text-sm">
          {cell ? new Date(cell.toString()).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      name: "Actions",
      field: "_id",
      style: { width: "100px", textAlign: "center" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          {row.url && (
            <a href={row.url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          )}
          <Button
            size="sm"
            variant="outline"
            className="[--accent:red]"
            onClick={() => handleDelete(row)}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const totalSize = data?.data?.reduce((sum, f) => sum + (f.size || 0), 0) ?? 0;

  return (
    <main className="space-y-6">
      <PageHeader
        name="Files"
        description="Manage uploaded files and assets"
        slot={<HardDrive className="h-5 w-5" />}
      />

      {data?.data && data.data.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <Card.Content className="p-4">
              <p className="text-muted-foreground text-sm">Total Files</p>
              <p className="text-2xl font-bold">{total}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-4">
              <p className="text-muted-foreground text-sm">Total Size</p>
              <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-4">
              <p className="text-muted-foreground text-sm">Images</p>
              <p className="text-2xl font-bold">
                {data.data.filter((f) => f.mimetype?.startsWith("image/")).length}
              </p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content className="p-4">
              <p className="text-muted-foreground text-sm">Cloud Files</p>
              <p className="text-2xl font-bold">
                {data.data.filter((f) => f.provider === "gcs").length}
              </p>
            </Card.Content>
          </Card>
        </div>
      )}

      <Card>
        <Card.Content>
          <DataTable
            columns={columns}
            data={data?.data || []}
            status={isLoading ? "loading" : isError ? "error" : "success"}
            config={{
              isSearchProcessed: false,
              isSortProcessed: false,
              isPaginationProcessed: false,
            }}
            state={{
              search,
              sort,
              page,
              limit,
              total,
              setSearch,
              setSort,
              setPage,
              setLimit,
            }}
          />
        </Card.Content>
      </Card>
    </main>
  );
};

export default FilesPage;
