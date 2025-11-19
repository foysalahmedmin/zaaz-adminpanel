import EventsStatisticsSection from "@/components/(common)/events-page/CategoriesStatisticsSection";
import EventsDataTableSection from "@/components/(common)/events-page/EventsDataTableSection";
import EventAddModal from "@/components/modals/EventAddModal";
import EventEditModal from "@/components/modals/EventEditModal";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import useAlert from "@/hooks/ui/useAlert";
import {
  closeAddModal,
  closeEditModal,
  openAddModal,
  openEditModal,
  setLimit,
  setPage,
  setSearch,
  setSort,
} from "@/redux/slices/events-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteEvent,
  fetchEvents,
  updateEvent,
} from "@/services/event.service";
import type { TEvent, TEventUpdatePayload } from "@/types/event.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const EventsPage = () => {
  const { activeBreadcrumbs } = useMenu();
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const {
    page,
    limit,
    search,
    sort,
    isAddModalOpen,
    isEditModalOpen,
    selectedEvent,
  } = useSelector((state: RootState) => state.eventsPage);

  const onOpenAddModal = () => {
    dispatch(openAddModal());
  };

  const onOpenEditModal = (event: TEvent) => {
    dispatch(openEditModal(event));
  };

  const update_mutation = useMutation({
    mutationFn: ({
      _id,
      payload,
    }: {
      _id: string;
      payload: TEventUpdatePayload;
    }) => updateEvent(_id, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update event");
      console.error("Update Event Error:", error);
    },
  });

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteEvent(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Event deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete event");
      console.error("Delete Event Error:", error);
    },
  });

  const onToggleFeatured = async (Event: TEvent) => {
    const payload = { is_featured: !Event.is_featured };
    update_mutation.mutate({ _id: Event._id, payload });
  };

  const onDelete = async (event: TEvent) => {
    const ok = await confirm({
      title: "Delete Event",
      message: "Are you sure you want to delete this Event?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(event._id);
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "events",
      {
        sort,
        search,
        page,
        limit,
      },
    ],
    queryFn: () =>
      fetchEvents({
        page,
        limit,
        sort: sort || "-published_at",
        ...(search && { search }),
      }),
  });

  return (
    <main className="space-y-6">
      <PageHeader
        name="Events"
        slot={
          <Button onClick={() => onOpenAddModal()}>
            <Plus className="h-4 w-4" /> Add Event
          </Button>
        }
      />
      <EventsStatisticsSection meta={data?.meta} />
      <Card>
        <Card.Content>
          <EventsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
            onAdd={onOpenAddModal}
            onEdit={onOpenEditModal}
            onDelete={onDelete}
            onToggleFeatured={onToggleFeatured}
            state={{
              total: data?.meta?.total || 0,
              page,
              setPage: (value: number) => dispatch(setPage(value)),
              limit,
              setLimit: (value: number) => dispatch(setLimit(value)),
              search,
              setSearch: (value: string) => dispatch(setSearch(value)),
              sort,
              setSort: (value: string) => dispatch(setSort(value)),
            }}
          />
        </Card.Content>
      </Card>
      <EventAddModal
        isOpen={isAddModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(value ? openAddModal() : closeAddModal())
        }
      />
      <EventEditModal
        default={selectedEvent || ({} as TEvent)}
        isOpen={isEditModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openEditModal(selectedEvent || ({} as TEvent))
              : closeEditModal(),
          )
        }
      />
    </main>
  );
};

export default EventsPage;
