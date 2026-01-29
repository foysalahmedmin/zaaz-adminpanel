// Feature feedbacks page
import FeatureFeedbacksDataTableSection from "@/components/(common)/feature-feedbacks-page/FeatureFeedbacksDataTableSection";
import FeatureFeedbacksFilterSection from "@/components/(common)/feature-feedbacks-page/FeatureFeedbacksFilterSection";
import FeatureFeedbackViewModal from "@/components/modals/FeatureFeedbackViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import {
  setFilters,
  setIsViewModalOpen,
  setSelectedFeedback,
} from "@/redux/slices/feature-feedbacks-page-slice";
import type { RootState } from "@/redux/store";
import {
  deleteFeatureFeedback,
  deleteFeatureFeedbacks,
  fetchFeatureFeedbacks,
  updateFeatureFeedback,
} from "@/services/feature-feedback.service";
import type { TFeatureFeedback } from "@/types/feature-feedback.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const FeatureFeedbacksPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();
  const dispatch = useDispatch();

  const { filters } = useSelector(
    (state: RootState) => state.featureFeedbacksPage,
  );

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Local filter states
  const [status, setStatus] = useState<string>(filters.status || "null");
  const [category, setCategory] = useState<string>(filters.category || "null");

  const resetFilters = () => {
    setStatus("null");
    setCategory("null");
    setPage(1);
    dispatch(setFilters({ status: null, category: null }));
  };

  useEffect(() => {
    const statusValue = status === "null" ? null : status;
    const categoryValue = category === "null" ? null : category;
    dispatch(setFilters({ status: statusValue, category: categoryValue }));
    setPage(1);
  }, [status, category, dispatch]);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, limit };
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    return params;
  }, [page, limit, filters]);

  const { data, isLoading } = useQuery({
    queryKey: ["feature-feedbacks", queryParams],
    queryFn: () => fetchFeatureFeedbacks(queryParams),
  });

  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  const updateStatus_mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateFeatureFeedback(id, { status }),
    onSuccess: () => {
      toast.success("Feedback status updated");
      queryClient.invalidateQueries({ queryKey: ["feature-feedbacks"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update feedback");
    },
  });

  const delete_mutation = useMutation({
    mutationFn: (id: string) => deleteFeatureFeedback(id),
    onSuccess: () => {
      toast.success("Feedback deleted");
      queryClient.invalidateQueries({ queryKey: ["feature-feedbacks"] });
    },
  });

  const deleteBulk_mutation = useMutation({
    mutationFn: (ids: string[]) => deleteFeatureFeedbacks(ids),
    onSuccess: (_, variables) => {
      toast.success(`${variables.length} feedbacks deleted`);
      queryClient.invalidateQueries({ queryKey: ["feature-feedbacks"] });
    },
  });

  const onStatusUpdate = (id: string, newStatus: string) =>
    updateStatus_mutation.mutate({ id, status: newStatus });

  const onDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete Feedback",
      message: "Are you sure you want to delete this feedback?",
      confirmText: "Delete",
    });
    if (ok) delete_mutation.mutate(id);
  };

  const onView = (feedback: TFeatureFeedback) => {
    dispatch(setSelectedFeedback(feedback));
    dispatch(setIsViewModalOpen(true));
  };

  const onClearAll = async () => {
    const ok = await confirm({
      title: "Clear All Feedbacks",
      message:
        "Are you sure you want to clear ALL feedbacks? This cannot be undone.",
      confirmText: "Yes, Clear All",
    });
    if (ok) {
      const allFeedbackIds =
        data?.data?.map((feedback: TFeatureFeedback) => feedback._id) || [];
      if (allFeedbackIds.length > 0) {
        deleteBulk_mutation.mutate(allFeedbackIds);
      } else {
        toast.info("No feedbacks to clear.");
      }
    }
  };

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader name="Feature Feedbacks" />
        <button
          onClick={onClearAll}
          disabled={deleteBulk_mutation.isPending}
          className="bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          Clear Current Page
        </button>
      </div>
      <FeatureFeedbacksFilterSection
        status={status}
        setStatus={setStatus}
        category={category}
        setCategory={setCategory}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content className="pt-6">
          <FeatureFeedbacksDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
            onView={onView}
            state={{
              page,
              limit,
              total,
              setPage,
              setLimit,
            }}
          />
        </Card.Content>
      </Card>
      <FeatureFeedbackViewModal />
    </main>
  );
};

export default FeatureFeedbacksPage;
