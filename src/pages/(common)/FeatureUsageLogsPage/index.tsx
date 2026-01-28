import FeatureUsageLogsDataTableSection from "@/components/(common)/feature-usage-logs-page/FeatureUsageLogsDataTableSection";
import FeatureUsageLogsFilterSection from "@/components/(common)/feature-usage-logs-page/FeatureUsageLogsFilterSection";
import FeatureUsageLogsStatisticsSection from "@/components/(common)/feature-usage-logs-page/FeatureUsageLogsStatisticsSection";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useAlert from "@/hooks/ui/useAlert";
import { fetchFeatureEndpoints } from "@/services/feature-endpoint.service";
import {
  deleteFeatureUsageLog,
  fetchFeatureUsageLogs,
} from "@/services/feature-usage-log.service";
import { fetchFeatures } from "@/services/feature.service";
import type { TFeatureUsageLog } from "@/types/feature-usage-log.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const FeatureUsageLogsPage = () => {
  const queryClient = useQueryClient();
  const confirm = useAlert();

  const delete_mutation = useMutation({
    mutationFn: (_id: string) => deleteFeatureUsageLog(_id),
    onSuccess: (data) => {
      toast.success(data?.message || "Log deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["feature-usage-logs"] });
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to delete log");
    },
  });

  const onDelete = async (log: TFeatureUsageLog) => {
    const ok = await confirm({
      title: "Delete Usage Log",
      message: "Are you sure you want to delete this log entry?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (ok) {
      delete_mutation.mutate(log._id);
    }
  };

  // State management for search, sort, pagination
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filter states
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [feature, setFeature] = useState<string>("");
  const [featureEndpoint, setFeatureEndpoint] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Fetch Features and Endpoints for filters
  const { data: featuresData } = useQuery({
    queryKey: ["features", { limit: 100 }],
    queryFn: () => fetchFeatures({ limit: 100 }),
  });

  const { data: endpointsData } = useQuery({
    queryKey: ["feature-endpoints", { feature, limit: 100 }],
    queryFn: () => fetchFeatureEndpoints({ feature, limit: 100 }),
    enabled: true, // Fetch all if no feature selected, or filtered if selected
  });

  // Build query parameters from state
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (sort) params.sort = sort;
    if (search) params.search = search;
    if (gte) params.gte = gte;
    if (lte) params.lte = lte;
    if (feature) params.feature = feature;
    if (featureEndpoint) params.feature_endpoint = featureEndpoint;
    if (status) params.status = status;

    return params;
  }, [search, sort, page, limit, gte, lte, feature, featureEndpoint, status]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["feature-usage-logs", queryParams],
    queryFn: () => fetchFeatureUsageLogs(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    } else if (data?.data) {
      setTotal(data.data.length || 0);
    }
  }, [data]);

  const resetFilters = () => {
    setGte("");
    setLte("");
    setFeature("");
    setFeatureEndpoint("");
    setStatus("");
    setSearch("");
  };

  return (
    <main className="space-y-6">
      <PageHeader
        name="Feature Usage Logs"
        description="Monitor system feature usage and API calls"
      />

      <FeatureUsageLogsStatisticsSection data={data?.data} meta={data?.meta} />

      <FeatureUsageLogsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        feature={feature}
        setFeature={setFeature}
        featureEndpoint={featureEndpoint}
        setFeatureEndpoint={setFeatureEndpoint}
        status={status}
        setStatus={setStatus}
        featuresData={featuresData}
        endpointsData={endpointsData}
        onReset={resetFilters}
      />

      <Card>
        <Card.Content>
          <FeatureUsageLogsDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onDelete={onDelete}
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

export default FeatureUsageLogsPage;
