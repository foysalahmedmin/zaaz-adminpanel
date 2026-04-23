import AssignPackageModal from "@/components/modals/AssignPackageModal";
import CreditsTransactionViewModal from "@/components/modals/CreditsTransactionViewModal";
import GiveBonusCreditsModal from "@/components/modals/GiveBonusCreditsModal";
import PackageTransactionViewModal from "@/components/modals/PackageTransactionViewModal";
import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { Tabs } from "@/components/ui/Tabs";
import {
  closeViewModal as closeCreditsViewModal,
  openViewModal as openCreditsViewModal,
} from "@/redux/slices/credits-transactions-page-slice";
import {
  closeViewModal as closePackageViewModal,
  openViewModal as openPackageViewModal,
} from "@/redux/slices/package-transactions-page-slice";
import {
  closeViewModal as closePaymentViewModal,
  openViewModal as openPaymentViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchCreditsTransactions } from "@/services/credits-transaction.service";
import type { TPackageTransaction } from "@/services/package-transaction.service";
import { fetchPackageTransactions } from "@/services/package-transaction.service";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import { fetchUserWalletById } from "@/services/user-wallet.service";
import type { TCreditsTransaction } from "@/types/credits-transaction.type";
import type { TPackage } from "@/types/package.type";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import type { TPlan } from "@/types/plan.type";
import type { TErrorResponse } from "@/types/response.type";
import type { TUserWallet } from "@/types/user-wallet.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  Coins,
  CreditCard,
  Eye,
  Gift,
  Package,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";

const UserWalletsDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();

  const wallet = (location.state as { wallet?: TUserWallet })?.wallet;

  const [isBonusCreditsModalOpen, setIsBonusCreditsModalOpen] = useState(false);
  const [isAssignPackageModalOpen, setIsAssignPackageModalOpen] = useState(false);

  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentLimit] = useState(10);
  const [creditsPage, setCreditsPage] = useState(1);
  const [creditsLimit] = useState(10);
  const [packagePage, setPackagePage] = useState(1);
  const [packageLimit] = useState(10);

  const { data: walletResponse, isLoading, error } = useQuery({
    queryKey: ["user-wallet", id],
    queryFn: () => fetchUserWalletById(id || ""),
    enabled: !!id,
  });

  const currentWallet = walletResponse?.data || wallet;
  const userId = currentWallet?.user;

  const { data: paymentTransactionsResponse } = useQuery({
    queryKey: ["payment-transactions", "user", userId, paymentPage, paymentLimit],
    queryFn: () =>
      fetchPaymentTransactions({ user: userId, sort: "-created_at", limit: paymentLimit, page: paymentPage }),
    enabled: !!userId,
  });

  const { data: creditsTransactionsResponse } = useQuery({
    queryKey: ["credits-transactions", "user", userId, creditsPage, creditsLimit],
    queryFn: () =>
      fetchCreditsTransactions({ user: userId, sort: "-created_at", limit: creditsLimit, page: creditsPage }),
    enabled: !!userId,
  });

  const { data: packageTransactionsResponse } = useQuery({
    queryKey: ["package-transactions", "user", userId, packagePage, packageLimit],
    queryFn: () =>
      fetchPackageTransactions({ user: userId, sort: "-created_at", limit: packageLimit, page: packagePage }),
    enabled: !!userId,
  });

  const paymentTransactions = paymentTransactionsResponse?.data || [];
  const paymentMeta = paymentTransactionsResponse?.meta;
  const creditsTransactions = creditsTransactionsResponse?.data || [];
  const creditsMeta = creditsTransactionsResponse?.meta;
  const packageTransactions = packageTransactionsResponse?.data || [];
  const packageMeta = packageTransactionsResponse?.meta;

  const { isViewModalOpen: isPaymentViewModalOpen, selectedPaymentTransaction } = useSelector(
    (state: RootState) => state.paymentTransactionsPage,
  );
  const { isViewModalOpen: isCreditsViewModalOpen, selectedCreditsTransaction } = useSelector(
    (state: RootState) => state.creditsTransactionsPage,
  );
  const { isViewModalOpen: isPackageViewModalOpen, selectedPackageTransaction } = useSelector(
    (state: RootState) => state.packageTransactionsPage,
  );

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Error loading wallet</h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<TErrorResponse>).response?.data?.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!currentWallet) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">Wallet not found</h2>
        </div>
      </div>
    );
  }

  const latestPackageTransaction = packageTransactions[0] as TPackageTransaction | undefined;

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        <PageHeader
          name="Wallet Details"
          description="View wallet information and transaction history"
          slot={<Wallet />}
        />

        {/* Wallet Summary Card */}
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-start gap-6">
              <div className="border-border bg-primary/10 text-primary flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4">
                <Wallet className="h-10 w-10" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-foreground text-2xl font-bold">
                    Wallet #{currentWallet._id.slice(-8)}
                  </h3>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    {currentWallet.email || userId || "N/A"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="text-muted-foreground text-xs">Credits Balance</div>
                    <div className="text-foreground text-xl font-bold">{currentWallet.credits ?? 0}</div>
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="text-muted-foreground text-xs">Initial Credits</div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {currentWallet.initial_credits_given ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                      {currentWallet.initial_credits_given ? "Given" : "Not Given"}
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="text-muted-foreground text-xs">Initial Package</div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {currentWallet.initial_package_given ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                      {currentWallet.initial_package_given ? "Given" : "Not Given"}
                    </div>
                  </div>
                  {latestPackageTransaction && (
                    <div className="bg-primary/5 border-primary/20 rounded-lg border px-4 py-2">
                      <div className="text-muted-foreground text-xs">Active Package</div>
                      <div className="text-foreground text-sm font-semibold">
                        {typeof latestPackageTransaction.package === "object"
                          ? (latestPackageTransaction.package as TPackage).name
                          : "Package"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsBonusCreditsModalOpen(true)}>
                    <Gift className="mr-2 h-4 w-4" />
                    Give Bonus Credits
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsAssignPackageModalOpen(true)}>
                    <Package className="mr-2 h-4 w-4" />
                    Assign Package
                  </Button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Wallet Details */}
        <Card>
          <div className="space-y-4 p-6">
            <h3 className="text-foreground text-lg font-semibold">Wallet Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground mb-1 text-xs">Wallet ID</div>
                <div className="text-foreground font-mono text-sm">{currentWallet._id}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground mb-1 text-xs">User ID</div>
                <div className="text-foreground font-mono text-sm">{userId || "N/A"}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground mb-1 text-xs">Email</div>
                <div className="text-foreground text-sm">{currentWallet.email || "N/A"}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground mb-1 text-xs">Credits</div>
                <div className="text-foreground text-xl font-bold">{currentWallet.credits ?? 0}</div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground mb-1 text-xs">Initial Credits Given</div>
                <div className="text-foreground text-sm font-medium">
                  {currentWallet.initial_credits_given ? "Yes" : "No"}
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="text-muted-foreground mb-1 text-xs">Initial Package Given</div>
                <div className="text-foreground text-sm font-medium">
                  {currentWallet.initial_package_given ? "Yes" : "No"}
                </div>
              </div>
              {currentWallet.created_at && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-xs">Created At</div>
                  <div className="text-foreground text-sm">
                    {new Date(currentWallet.created_at).toLocaleString()}
                  </div>
                </div>
              )}
              {currentWallet.updated_at && (
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-xs">Updated At</div>
                  <div className="text-foreground text-sm">
                    {new Date(currentWallet.updated_at).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Transactions */}
        <Card>
          <Card.Header className="border-b">
            <h2 className="text-foreground text-xl font-semibold">Transaction History</h2>
          </Card.Header>
          <Card.Content className="p-6">
            <Tabs defaultValue="packages">
              <Tabs.List>
                <Tabs.Trigger value="packages">
                  <Package className="mr-1.5 h-4 w-4" />
                  Package ({packageMeta?.total ?? packageTransactions.length})
                </Tabs.Trigger>
                <Tabs.Trigger value="payments">
                  <CreditCard className="mr-1.5 h-4 w-4" />
                  Payment ({paymentMeta?.total ?? paymentTransactions.length})
                </Tabs.Trigger>
                <Tabs.Trigger value="credits">
                  <Coins className="mr-1.5 h-4 w-4" />
                  Credits ({creditsMeta?.total ?? creditsTransactions.length})
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content>
                {/* Package Transactions */}
                <Tabs.Item value="packages">
                  <div className="mt-4 space-y-2">
                    {packageTransactions.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">No package transactions found</p>
                    ) : (
                      packageTransactions.map((tx: TPackageTransaction) => (
                        <div
                          key={tx._id}
                          className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">
                              {typeof tx.package === "object"
                                ? (tx.package as TPackage).name
                                : "Package"}{" "}
                              —{" "}
                              {typeof tx.interval === "object"
                                ? (tx.interval as TPlan).name
                                : "Plan"}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              +{tx.credits} credits ·{" "}
                              <span className="capitalize">{tx.increase_source}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {tx.created_at && (
                              <p className="text-muted-foreground text-sm">
                                {new Date(tx.created_at).toLocaleDateString()}
                              </p>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dispatch(openPackageViewModal(tx))}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    {packageMeta && (
                      <Pagination
                        total={packageMeta.total || 0}
                        limit={packageLimit}
                        page={packagePage}
                        setLimit={() => {}}
                        setPage={setPackagePage}
                        className="mt-4 border-t pt-4"
                      />
                    )}
                  </div>
                </Tabs.Item>

                {/* Payment Transactions */}
                <Tabs.Item value="payments">
                  <div className="mt-4 space-y-2">
                    {paymentTransactions.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">No payment transactions found</p>
                    ) : (
                      paymentTransactions.map((tx: TPaymentTransaction) => (
                        <div
                          key={tx._id}
                          className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-semibold">
                              {tx.currency === "USD" ? "$" : "৳"}{tx.amount}
                            </p>
                            <p className="text-muted-foreground font-mono text-xs">
                              {tx.gateway_transaction_id}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                                tx.status === "success"
                                  ? "bg-green-100 text-green-800"
                                  : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tx.status}
                            </span>
                            {tx.created_at && (
                              <p className="text-muted-foreground text-sm">
                                {new Date(tx.created_at).toLocaleDateString()}
                              </p>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => dispatch(openPaymentViewModal(tx))}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                    {paymentMeta && (
                      <Pagination
                        total={paymentMeta.total || 0}
                        limit={paymentLimit}
                        page={paymentPage}
                        setLimit={() => {}}
                        setPage={setPaymentPage}
                        className="mt-4 border-t pt-4"
                      />
                    )}
                  </div>
                </Tabs.Item>

                {/* Credits Transactions */}
                <Tabs.Item value="credits">
                  <div className="mt-4 space-y-2">
                    {creditsTransactions.length === 0 ? (
                      <p className="text-muted-foreground py-8 text-center text-sm">No credits transactions found</p>
                    ) : (
                      creditsTransactions.map((tx: TCreditsTransaction) => {
                        const decreaseSource =
                          typeof tx.decrease_source === "object" && tx.decrease_source
                            ? ((tx.decrease_source as any).name ?? (tx.decrease_source as any)._id ?? "N/A")
                            : tx.decrease_source;
                        return (
                          <div
                            key={tx._id}
                            className="border-border hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
                          >
                            <div className="flex-1">
                              <p
                                className={`font-semibold ${
                                  tx.type === "increase" ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {tx.type === "increase" ? "+" : "-"}{tx.credits} credits
                              </p>
                              <p className="text-muted-foreground text-sm capitalize">
                                {tx.increase_source || (decreaseSource ? `Feature: ${decreaseSource}` : null)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {tx.created_at && (
                                <p className="text-muted-foreground text-sm">
                                  {new Date(tx.created_at).toLocaleDateString()}
                                </p>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => dispatch(openCreditsViewModal(tx))}
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                    {creditsMeta && (
                      <Pagination
                        total={creditsMeta.total || 0}
                        limit={creditsLimit}
                        page={creditsPage}
                        setLimit={() => {}}
                        setPage={setCreditsPage}
                        className="mt-4 border-t pt-4"
                      />
                    )}
                  </div>
                </Tabs.Item>
              </Tabs.Content>
            </Tabs>
          </Card.Content>
        </Card>

        {/* Modals */}
        <PaymentTransactionViewModal
          default={selectedPaymentTransaction || ({} as TPaymentTransaction)}
          isOpen={isPaymentViewModalOpen}
          setIsOpen={(value) =>
            dispatch(value ? openPaymentViewModal(selectedPaymentTransaction || ({} as TPaymentTransaction)) : closePaymentViewModal())
          }
        />
        <CreditsTransactionViewModal
          default={selectedCreditsTransaction || ({} as TCreditsTransaction)}
          isOpen={isCreditsViewModalOpen}
          setIsOpen={(value) =>
            dispatch(value ? openCreditsViewModal(selectedCreditsTransaction || ({} as TCreditsTransaction)) : closeCreditsViewModal())
          }
        />
        <PackageTransactionViewModal
          default={selectedPackageTransaction || ({} as TPackageTransaction)}
          isOpen={isPackageViewModalOpen}
          setIsOpen={(value) =>
            dispatch(value ? openPackageViewModal(selectedPackageTransaction || ({} as TPackageTransaction)) : closePackageViewModal())
          }
        />
        <GiveBonusCreditsModal
          isOpen={isBonusCreditsModalOpen}
          setIsOpen={setIsBonusCreditsModalOpen}
          wallet={currentWallet}
        />
        <AssignPackageModal
          isOpen={isAssignPackageModalOpen}
          setIsOpen={setIsAssignPackageModalOpen}
          wallet={currentWallet}
        />
      </div>
    </div>
  );
};

export default UserWalletsDetailsPage;
