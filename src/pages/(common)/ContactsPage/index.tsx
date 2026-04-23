import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import type { TColumn } from "@/components/ui/DataTable";
import useAlert from "@/hooks/ui/useAlert";
import { deleteContact } from "@/services/contact.service";
import { fetchContacts } from "@/services/contact.service";
import type { TContact } from "@/types/contact.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Mail, MessageSquare, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ContactViewModal from "./ContactViewModal";

const ContactsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedContact, setSelectedContact] = useState<TContact | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      ...(sort && { sort }),
      ...(search && { search }),
    }),
    [page, limit, sort, search],
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contacts", queryParams],
    queryFn: () => fetchContacts(queryParams),
  });

  useEffect(() => {
    if (data?.meta?.total !== undefined) setTotal(data.meta.total);
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      toast.success("Contact deleted");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (err: AxiosError<TErrorResponse>) => {
      toast.error(err.response?.data?.message || "Failed to delete contact");
    },
  });

  const handleDelete = async (contact: TContact) => {
    const ok = await confirm({
      title: "Delete Contact",
      message: `Delete message from "${contact.name}"? This can be restored from the Recycle Bin.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) deleteMutation.mutate(contact._id);
  };

  const columns: TColumn<TContact>[] = [
    {
      name: "Sender",
      field: "name",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold">{row.name}</span>
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Mail className="h-3 w-3" />
            {row.email}
          </span>
        </div>
      ),
    },
    {
      name: "Subject",
      field: "subject",
      isSortable: true,
      isSearchable: true,
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-xs font-medium">{row.subject}</span>
      ),
    },
    {
      name: "Message",
      field: "message",
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-2 max-w-sm text-sm">
          {row.message}
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
      style: { width: "120px", textAlign: "center" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedContact(row);
              setIsViewOpen(true);
            }}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
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

  return (
    <main className="space-y-6">
      <PageHeader
        name="Contacts"
        description="Messages submitted via the contact form"
        slot={<Mail className="h-5 w-5" />}
      />

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

      {selectedContact && (
        <ContactViewModal
          contact={selectedContact}
          isOpen={isViewOpen}
          setIsOpen={setIsViewOpen}
        />
      )}
    </main>
  );
};

export default ContactsPage;
