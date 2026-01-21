import CreditsUsagesDataTableSection from "@/components/(common)/credits-usages-page/CreditsUsagesDataTableSection";
import CreditsUsagesFilterSection from "@/components/(common)/credits-usages-page/CreditsUsagesFilterSection";
import CreditsUsagesStatisticsSection from "@/components/(common)/credits-usages-page/CreditsUsagesStatisticsSection";
import CreditsUsageViewModal from "@/components/modals/CreditsUsageViewModal";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  closeViewModal,
  openViewModal,
} from "@/redux/slices/credits-usages-page-slice";
import type { RootState } from "@/redux/store";
import { fetchCreditsUsages } from "@/services/credits-usage.service";
import type { TCreditsUsage } from "@/types/credits-usage.type";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const CreditsUsagesPage = () => {
  const dispatch = useDispatch();

  const { isViewModalOpen, selectedCreditsUsage } = useSelector(
    (state: RootState) => state.creditsUsagesPage,
  );

  const onOpenViewModal = (usage: TCreditsUsage) => {
    dispatch(openViewModal(usage));
  };

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setAiModel("");
    setSearch("");
    setPage(1);
  };

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
    if (aiModel) params.ai_model = aiModel;

    return params;
  }, [search, sort, page, limit, gte, lte, aiModel]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["credits-usages", queryParams],
    queryFn: () => fetchCreditsUsages(queryParams),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="Credits Usages" />
      <CreditsUsagesStatisticsSection
        data={data?.data || []}
        meta={data?.meta}
      />
      <CreditsUsagesFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        aiModel={aiModel}
        setAiModel={setAiModel}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <CreditsUsagesDataTableSection
            data={data?.data || []}
            isLoading={isLoading}
            isError={isError}
            onView={onOpenViewModal}
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
      <CreditsUsageViewModal
        default={selectedCreditsUsage || ({} as TCreditsUsage)}
        isOpen={isViewModalOpen}
        setIsOpen={(value: boolean) =>
          dispatch(
            value
              ? openViewModal(selectedCreditsUsage || ({} as TCreditsUsage))
              : closeViewModal(),
          )
        }
      />
    </main>
  );
};

export default CreditsUsagesPage;
