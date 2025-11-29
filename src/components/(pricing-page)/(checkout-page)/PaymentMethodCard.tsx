import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { TPaymentMethod } from "@/types/payment-method.type";
import { CreditCard, Loader2 } from "lucide-react";

type PaymentMethodCardProps = {
  methods: TPaymentMethod[];
  selectedMethodId: string;
  selectedPlan: any;
  isBangladesh: boolean | null;
  onMethodSelect: (methodId: string) => void;
  onPaymentInitiate: () => void;
  isProcessing: boolean;
  isDisabled: boolean;
};

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  methods,
  selectedMethodId,
  selectedPlan,
  isBangladesh,
  onMethodSelect,
  onPaymentInitiate,
  isProcessing,
  isDisabled,
}) => {
  const selectedMethod = methods.find((m) => m._id === selectedMethodId);

  return (
    <Card className="flex flex-col">
      <Card.Header className="border-b">
        <h2 className="text-xl font-semibold">Select Payment Method</h2>
      </Card.Header>
      <Card.Content className="flex flex-1 flex-col space-y-4">
        {isBangladesh !== null && (
          <div className="bg-muted/50 mb-2 rounded-md px-3 py-2 text-sm">
            <p className="text-muted-foreground">
              {isBangladesh
                ? "Payment methods available for Bangladesh"
                : "International payment methods available"}
            </p>
          </div>
        )}

        {methods.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No payment methods available for your location at the moment.
            </p>
            {isBangladesh === null && (
              <p className="text-muted-foreground mt-2 text-xs">
                Unable to detect your location. Please refresh the page.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {methods.map((method: TPaymentMethod) => (
              <label
                key={method._id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                  selectedMethodId === method._id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                } `}
              >
                <input
                  hidden
                  type="radio"
                  name="paymentMethod"
                  value={method._id}
                  checked={selectedMethodId === method._id}
                  onChange={(e) => onMethodSelect(e.target.value)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{method.name}</span>
                    <span className="text-muted-foreground text-sm">
                      {method.currency}
                    </span>
                  </div>
                  {method.description && (
                    <p className="text-muted-foreground mt-1 text-sm">
                      {method.description}
                    </p>
                  )}
                  {method.is_test && (
                    <span className="mt-1 inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                      Test Mode
                    </span>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {selectedMethod && selectedPlan && (
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>
                  {(() => {
                    const amount =
                      selectedMethod.currency === "USD"
                        ? selectedPlan.price.USD
                        : selectedPlan.price.BDT;
                    return new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: selectedMethod.currency,
                    }).format(amount);
                  })()}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card.Content>
      <Card.Footer>
        <Button
          onClick={onPaymentInitiate}
          disabled={isDisabled}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Proceed to Payment
            </>
          )}
        </Button>
      </Card.Footer>
    </Card>
  );
};


