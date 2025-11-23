import PaymentTransactionViewModal from "@/components/modals/PaymentTransactionViewModal";
import TokenTransactionViewModal from "@/components/modals/TokenTransactionViewModal";
import Loader from "@/components/partials/Loader";
import PageHeader from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { URLS } from "@/config";
import {
  closeViewModal as closePaymentViewModal,
  openViewModal as openPaymentViewModal,
} from "@/redux/slices/payment-transactions-page-slice";
import {
  closeViewModal as closeTokenViewModal,
  openViewModal as openTokenViewModal,
} from "@/redux/slices/token-transactions-page-slice";
import type { RootState } from "@/redux/store";
import { fetchPaymentTransactions } from "@/services/payment-transaction.service";
import { fetchTokenTransactions } from "@/services/token-transaction.service";
import { fetchUserWallet } from "@/services/user-wallet.service";
import { fetchUser } from "@/services/user.service";
import type { TPaymentTransaction } from "@/types/payment-transaction.type";
import type { ErrorResponse } from "@/types/response.type";
import type { TTokenTransaction } from "@/types/token-transaction.type";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  AlertCircle,
  CheckCircle,
  Coins,
  CreditCard,
  FileText,
  Mail,
  Shield,
  User,
  Wallet,
} from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

const UserDetailsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // Fetch user data (admin endpoint)
  const {
    data: userResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id || ""),
    enabled: !!id,
  });

  const user = userResponse?.data;
  const userId = id;

  // Fetch wallet data (admin endpoint)
  const { data: walletResponse } = useQuery({
    queryKey: ["user-wallet", "user", userId],
    queryFn: () => fetchUserWallet(userId || ""),
    enabled: !!userId,
  });

  const wallet = walletResponse?.data;

  // Fetch payment transactions (admin endpoint)
  const { data: paymentTransactionsResponse } = useQuery({
    queryKey: ["payment-transactions", "user", userId],
    queryFn: () =>
      fetchPaymentTransactions({
        user: userId,
        sort: "-created_at",
        limit: 10,
      }),
    enabled: !!userId,
  });

  const paymentTransactions = paymentTransactionsResponse?.data || [];

  // Fetch token transactions (admin endpoint)
  const { data: tokenTransactionsResponse } = useQuery({
    queryKey: ["token-transactions", "user", userId],
    queryFn: () =>
      fetchTokenTransactions({
        user: userId,
        sort: "-created_at",
        limit: 10,
      }),
    enabled: !!userId,
  });

  const tokenTransactions = tokenTransactionsResponse?.data || [];

  const {
    isViewModalOpen: isPaymentViewModalOpen,
    selectedPaymentTransaction,
  } = useSelector((state: RootState) => state.paymentTransactionsPage);
  const { isViewModalOpen: isTokenViewModalOpen, selectedTokenTransaction } =
    useSelector((state: RootState) => state.tokenTransactionsPage);

  const getRoleColor = (role: string) => {
    const colors = {
      "super-admin": "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      admin: "bg-red-500/10 text-red-600 dark:text-red-400",
      editor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      author: "bg-green-500/10 text-green-600 dark:text-green-400",
      contributor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      subscriber: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
      user: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    };
    return colors[role as keyof typeof colors] || colors.user;
  };

  const getStatusColor = (status: string) => {
    return status === "in-progress"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : "bg-red-500/10 text-red-600 dark:text-red-400";
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold">Error loading user</h2>
          <p className="mt-2 text-gray-500">
            {(error as AxiosError<ErrorResponse>).response?.data?.message ||
              "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
          <h2 className="mt-4 text-xl font-semibold">User not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background p-4">
      <div className="container space-y-6">
        {/* Header */}
        <PageHeader
          name="User Details"
          description="View user information and transactions"
          slot={<User />}
        />

        {/* Profile Information Card */}
        <Card>
          <Card.Content className="p-6">
            {/* View Mode */}
            <div className="space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={
                      user.image
                        ? URLS.user + "/" + user.image
                        : "/images/avatar.png"
                    }
                    alt={user.name}
                    className="border-border h-24 w-24 rounded-full border-4 object-cover"
                  />
                  {user.is_verified && (
                    <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 rounded-full p-1">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-foreground text-2xl font-bold">
                      {user.name}
                    </h3>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getRoleColor(
                        user.role,
                      )}`}
                    >
                      <Shield className="mr-1 inline h-4 w-4" />
                      {user.role.replace("-", " ")}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${getStatusColor(
                        user.status,
                      )}`}
                    >
                      {user.status === "in-progress" ? "Active" : "Blocked"}
                    </span>
                    {user.is_verified && (
                      <span className="text-primary bg-primary/10 flex gap-2 rounded-full px-2 py-1 text-sm font-medium">
                        <CheckCircle className="inline h-4 w-4" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <div className="space-y-6 p-6">
            {/* Description */}
            {user?.name && (
              <div>
                <h3 className="text-foreground mb-3 flex items-center text-lg font-semibold">
                  <FileText className="mr-2 h-5 w-5" />
                  Name
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {user?.name}
                </p>
              </div>
            )}

            {/* Category Details */}
            <div>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Category Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    User ID
                  </div>
                  <div className="text-foreground font-mono text-sm">
                    {user?._id}
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="text-muted-foreground mb-1 text-sm">
                    User Status
                  </div>
                  <div className="text-foreground text-sm">
                    {user?.status || "None"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Wallet & Transactions Card */}
        {wallet && (
          <Card>
            <Card.Header className="border-b">
              <h2 className="text-foreground text-xl font-semibold">
                Wallet & Transactions
              </h2>
            </Card.Header>
            <Card.Content className="p-6">
              <Tabs defaultValue="wallet">
                <Tabs.List>
                  <Tabs.Trigger
                    className="flex items-center gap-2"
                    value="wallet"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Wallet
                    </div>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="flex items-center gap-2"
                    value="payments"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Transactions
                    </div>
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    className="flex items-center gap-2"
                    value="tokens"
                  >
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Token Transactions
                    </div>
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content>
                  <Tabs.Item value="wallet">
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-muted-foreground mb-1 text-sm">
                            Tokens
                          </div>
                          <div className="text-foreground text-2xl font-bold">
                            {wallet?.token || 0}
                          </div>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <div className="text-muted-foreground mb-1 text-sm">
                            Package
                          </div>
                          <div className="text-foreground text-sm">
                            {typeof wallet?.package === "object" &&
                            wallet.package
                              ? (wallet.package as any).name
                              : wallet?.package || "N/A"}
                          </div>
                        </div>
                        {wallet?.expires_at && (
                          <div className="bg-muted rounded-lg p-4">
                            <div className="text-muted-foreground mb-1 text-sm">
                              Expires At
                            </div>
                            <div
                              className={`text-sm font-semibold ${
                                new Date(wallet.expires_at) < new Date()
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {new Date(wallet.expires_at).toLocaleString()}
                              {new Date(wallet.expires_at) < new Date() &&
                                " (Expired)"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Tabs.Item>
                  <Tabs.Item value="payments">
                    <div className="mt-4 space-y-4">
                      {paymentTransactions.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">
                          No payment transactions found
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {paymentTransactions.map(
                            (transaction: TPaymentTransaction) => (
                              <div
                                key={transaction._id}
                                className="border-border hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
                                onClick={() =>
                                  dispatch(openPaymentViewModal(transaction))
                                }
                              >
                                <div>
                                  <p className="font-semibold">
                                    {transaction.currency === "USD" ? "$" : "৳"}
                                    {transaction.amount}
                                  </p>
                                  <p className="text-muted-foreground text-sm">
                                    {transaction.gateway_transaction_id}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                                      transaction.status === "success"
                                        ? "bg-green-100 text-green-800"
                                        : transaction.status === "pending"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {transaction.status}
                                  </span>
                                  {transaction.created_at && (
                                    <p className="text-muted-foreground mt-1 text-xs">
                                      {new Date(
                                        transaction.created_at,
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </Tabs.Item>
                  <Tabs.Item value="tokens">
                    <div className="mt-4 space-y-4">
                      {tokenTransactions.length === 0 ? (
                        <div className="text-muted-foreground py-8 text-center">
                          No token transactions found
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {tokenTransactions.map(
                            (transaction: TTokenTransaction) => (
                              <div
                                key={transaction._id}
                                className="border-border hover:bg-muted flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors"
                                onClick={() =>
                                  dispatch(openTokenViewModal(transaction))
                                }
                              >
                                <div>
                                  <p
                                    className={`font-semibold ${
                                      transaction.type === "increase"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {transaction.type === "increase"
                                      ? "+"
                                      : "-"}
                                    {transaction.amount} tokens
                                  </p>
                                  {transaction.increase_source && (
                                    <p className="text-muted-foreground text-sm capitalize">
                                      Source: {transaction.increase_source}
                                    </p>
                                  )}
                                </div>
                                {transaction.created_at && (
                                  <p className="text-muted-foreground text-sm">
                                    {new Date(
                                      transaction.created_at,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </Tabs.Item>
                </Tabs.Content>
              </Tabs>
            </Card.Content>
          </Card>
        )}

        {/* Modals */}
        <PaymentTransactionViewModal
          default={
            selectedPaymentTransaction || ({} as TPaymentTransaction)
          }
          isOpen={isPaymentViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openPaymentViewModal(
                    selectedPaymentTransaction ||
                      ({} as TPaymentTransaction),
                  )
                : closePaymentViewModal(),
            )
          }
        />
        <TokenTransactionViewModal
          default={selectedTokenTransaction || ({} as TTokenTransaction)}
          isOpen={isTokenViewModalOpen}
          setIsOpen={(value: boolean) =>
            dispatch(
              value
                ? openTokenViewModal(
                    selectedTokenTransaction || ({} as TTokenTransaction),
                  )
                : closeTokenViewModal(),
            )
          }
        />
      </div>
    </div>
  );
};

export default UserDetailsPage;

