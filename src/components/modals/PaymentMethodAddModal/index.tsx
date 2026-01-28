import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createPaymentMethod } from "@/services/payment-method.service";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PaymentMethodAddModalProps = {
  default?: Partial<TPaymentMethod>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

// Form type that allows config to be a string (from textarea) or object
type PaymentMethodFormData = Omit<Partial<TPaymentMethod>, "config"> & {
  config?: string | Record<string, unknown>;
};

const PaymentMethodAddModal: React.FC<PaymentMethodAddModalProps> = ({
  isOpen,
  setIsOpen,
  default: paymentMethod,
  mutationKey: key = ["payment-methods"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    defaultValues: {
      name: paymentMethod?.name || "",
      value: paymentMethod?.value || "",
      currency: paymentMethod?.currency || "USD",
      description: paymentMethod?.description || "",
      sequence: paymentMethod?.sequence || 0,
      is_test: paymentMethod?.is_test ?? false,
      is_active: paymentMethod?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: (data) => {
      toast.success(data?.message || "Payment method created successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment method",
      );
    },
  });

  const onSubmit = (data: PaymentMethodFormData) => {
    // Parse config if it's a string (JSON)
    let parsedConfig: Record<string, unknown> | undefined = undefined;
    if (typeof data.config === "string" && data.config.trim()) {
      try {
        parsedConfig = JSON.parse(data.config);
      } catch (error) {
        toast.error("Invalid JSON in config field");
        return;
      }
    } else if (typeof data.config === "object" && data.config !== null) {
      parsedConfig = data.config;
    }

    mutation.mutate({
      ...data,
      value: data.value?.toLowerCase(),
      currency: data.currency?.toUpperCase() as "USD" | "BDT",
      config: parsedConfig,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Payment Method</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name *</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g., Stripe, SSL Commerz"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name && (
                  <FormControl.Error>{errors.name.message}</FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Value *</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g., stripe, sslcommerz"
                  {...register("value", {
                    required: "Value is required",
                    minLength: {
                      value: 2,
                      message: "Value must be at least 2 characters",
                    },
                  })}
                />
                {errors.value && (
                  <FormControl.Error>{errors.value.message}</FormControl.Error>
                )}
                <FormControl.Helper>
                  Lowercase identifier for the payment method
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Currency *</FormControl.Label>
                <FormControl
                  as="select"
                  className="border-input bg-card w-full rounded-md border px-3 py-2 text-sm"
                  {...register("currency", {
                    required: "Currency is required",
                  })}
                >
                  <option value="USD">USD</option>
                  <option value="BDT">BDT</option>
                </FormControl>
                {errors.currency && (
                  <FormControl.Error>
                    {errors.currency.message}
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Description</FormControl.Label>
                <FormControl
                  as="textarea"
                  className="h-auto min-h-20 py-2"
                  placeholder="Enter description (optional)"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                />
                {errors.description && (
                  <FormControl.Error>
                    {errors.description.message}
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Config (JSON)</FormControl.Label>
                <FormControl
                  as="textarea"
                  className="h-auto min-h-32 py-2 font-mono text-sm"
                  placeholder={`{\n  "appKey": "your_app_key",\n  "appSecret": "your_app_secret",\n  "username": "your_username",\n  "password": "your_password"\n}`}
                  {...register("config")}
                />
                {errors.config && (
                  <FormControl.Error>
                    {(errors.config as any)?.message || "Invalid config format"}
                  </FormControl.Error>
                )}
                <FormControl.Helper>
                  Gateway-specific configuration in JSON format (e.g., bKash
                  credentials). Leave empty to use environment variables.
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Sequence</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("sequence", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Sequence must be 0 or greater" },
                  })}
                />
                {errors.sequence && (
                  <FormControl.Error>
                    {errors.sequence.message}
                  </FormControl.Error>
                )}
                <FormControl.Helper>
                  Lower numbers appear first when sorting by sequence
                </FormControl.Helper>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-accent size-5"
                    id="is_test"
                    {...register("is_test")}
                  />
                  <FormControl.Label htmlFor="is_test" className="font-normal">
                    Test Mode
                  </FormControl.Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-accent size-5"
                    id="is_active"
                    {...register("is_active")}
                  />
                  <FormControl.Label
                    htmlFor="is_active"
                    className="font-normal"
                  >
                    Active
                  </FormControl.Label>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PaymentMethodAddModal;
