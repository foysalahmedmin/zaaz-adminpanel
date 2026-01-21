import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DatePicker } from "@/components/ui/DatePicker";
import { FormControl } from "@/components/ui/FormControl";
import { X } from "lucide-react";
import React from "react";

import type { TPaymentMethod } from "@/types/payment-method.type";

type PaymentTransactionsFilterSectionProps = {
  gte: string;
  setGte: (value: string) => void;
  lte: string;
  setLte: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  paymentMethodsData?: { data?: TPaymentMethod[] };
  onReset: () => void;
};

const PaymentTransactionsFilterSection: React.FC<
  PaymentTransactionsFilterSectionProps
> = ({
  gte,
  setGte,
  lte,
  setLte,
  status,
  setStatus,
  paymentMethod,
  setPaymentMethod,
  paymentMethodsData,
  onReset,
}) => {
  return (
    <Card>
      <Card.Header className="border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground h-8 px-2"
          >
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </Card.Header>
      <Card.Content>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1 md:col-span-2 lg:col-span-2">
            <FormControl.Label>Date Range (From - To)</FormControl.Label>
            <div className="border-input focus-within:ring-accent flex w-full items-center gap-0 overflow-hidden rounded-md border focus-within:ring-1">
              <DatePicker
                value={gte}
                onChange={(e) => setGte(e.target.value)}
                className="shrink border-0 focus-visible:ring-0"
                placeholder="From"
              />
              <div className="bg-muted text-muted-foreground border-input flex h-9 shrink-0 items-center border-x px-2">
                <span className="font-mono text-[10px] font-bold">TO</span>
              </div>
              <DatePicker
                value={lte}
                onChange={(e) => setLte(e.target.value)}
                className="shrink border-0 focus-visible:ring-0"
                placeholder="To"
              />
            </div>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Status</FormControl.Label>
            <FormControl
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </FormControl>
          </div>
          <div className="space-y-1">
            <FormControl.Label>Payment Method</FormControl.Label>
            <FormControl
              as="select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-9"
            >
              <option value="">All Methods</option>
              {paymentMethodsData?.data?.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </FormControl>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default PaymentTransactionsFilterSection;
