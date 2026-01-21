import UserWalletsDataTableSection from "@/components/(common)/user-wallets-page/UserWalletsDataTableSection";
import UserWalletsFilterSection from "@/components/(common)/user-wallets-page/UserWalletsFilterSection";
import UserWalletsStatisticsSection from "@/components/(common)/user-wallets-page/UserWalletsStatisticsSection";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import useMenu from "@/hooks/states/useMenu";
import { fetchPackages } from "@/services/package.service";
import { fetchUserWallets } from "@/services/user-wallet.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const UserWalletsPage = () => {
  const { activeBreadcrumbs } = useMenu();

  // State management for search, sort, pagination, and filters
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("-created_at");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  // Filters state
  const [gte, setGte] = useState<string>("");
  const [lte, setLte] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");

  const resetFilters = () => {
    setGte("");
    setLte("");
    setStatus("");
    setPackageId("");
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
    if (status) params.status = status;
    if (packageId) params.package = packageId;

    return params;
  }, [search, sort, page, limit, gte, lte, status, packageId]);

  // Fetch data with query parameters
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-wallets", queryParams],
    queryFn: () => fetchUserWallets(queryParams),
  });

  // Fetch packages for filter
  const { data: packagesData } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackages({ limit: 100 }),
  });

  // Update total from response
  useEffect(() => {
    if (data?.meta?.total !== undefined) {
      setTotal(data.meta.total);
    }
  }, [data]);

  return (
    <main className="space-y-6">
      <PageHeader name="User Wallets" />
      <UserWalletsStatisticsSection data={data?.data || []} meta={data?.meta} />
      <UserWalletsFilterSection
        gte={gte}
        setGte={setGte}
        lte={lte}
        setLte={setLte}
        status={status}
        setStatus={setStatus}
        packageId={packageId}
        setPackageId={setPackageId}
        packagesData={packagesData}
        onReset={resetFilters}
      />
      <Card>
        <Card.Content>
          <UserWalletsDataTableSection
            data={data?.data || []}
            breadcrumbs={activeBreadcrumbs || []}
            isLoading={isLoading}
            isError={isError}
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

export default UserWalletsPage;
