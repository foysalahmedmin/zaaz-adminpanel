import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { updatePaymentMethod } from "@/services/payment-method.service";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PaymentMethodEditModalProps = {
  default: TPaymentMethod;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const PaymentMethodEditModal: React.FC<PaymentMethodEditModalProps> = ({
  default: paymentMethod,
  isOpen,
  setIsOpen,
  mutationKey: key = ["payment-methods"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TPaymentMethod>>({
    defaultValues: {
      name: paymentMethod?.name || "",
      value: paymentMethod?.value || "",
      currency: paymentMethod?.currency || "USD",
      description: paymentMethod?.description || "",
      secret: paymentMethod?.secret || "",
      public_key: paymentMethod?.public_key || "",
      webhook_key: paymentMethod?.webhook_key || "",
      webhook_url: paymentMethod?.webhook_url || "",
      is_test: paymentMethod?.is_test ?? false,
      is_active: paymentMethod?.is_active ?? true,
    },
  });

  // Reset form when paymentMethod changes or modal opens
  useEffect(() => {
    if (isOpen && paymentMethod) {
      reset({
        name: paymentMethod?.name || "",
        value: paymentMethod?.value || "",
        currency: paymentMethod?.currency || "USD",
        description: paymentMethod?.description || "",
        secret: paymentMethod?.secret || "",
        public_key: paymentMethod?.public_key || "",
        webhook_key: paymentMethod?.webhook_key || "",
        webhook_url: paymentMethod?.webhook_url || "",
        is_test: paymentMethod?.is_test ?? false,
        is_active: paymentMethod?.is_active ?? true,
      });
    }
  }, [paymentMethod, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<TPaymentMethod>) =>
      updatePaymentMethod(paymentMethod._id, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Payment method updated successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to update payment method",
      );
    },
  });

  const onSubmit = (data: Partial<TPaymentMethod>) => {
    mutation.mutate({
      ...data,
      value: data.value?.toLowerCase(),
      currency: data.currency?.toUpperCase() as "USD" | "BDT",
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Payment Method</Modal.Title>
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
                <FormControl.Label>Secret</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Enter new secret key (leave empty to keep current)"
                  {...register("secret")}
                />
                {errors.secret && (
                  <FormControl.Error>{errors.secret.message}</FormControl.Error>
                )}
                <FormControl.Helper>
                  Leave empty to keep current secret
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Public Key</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Enter public key (optional)"
                  {...register("public_key")}
                />
                {errors.public_key && (
                  <FormControl.Error>
                    {errors.public_key.message}
                  </FormControl.Error>
                )}
                <FormControl.Helper>
                  Publishable key for frontend use (e.g., Stripe publishable
                  key)
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Webhook Secret Key</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Enter webhook secret key (leave empty to keep current)"
                  {...register("webhook_key")}
                />
                {errors.webhook_key && (
                  <FormControl.Error>
                    {errors.webhook_key.message}
                  </FormControl.Error>
                )}
                <FormControl.Helper>
                  Webhook secret key for signature verification (e.g., Stripe
                  webhook secret: whsec_...). Leave empty to keep current.
                </FormControl.Helper>
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
                <FormControl.Label>Webhook URL</FormControl.Label>
                <FormControl
                  type="url"
                  placeholder="https://example.com/webhook"
                  {...register("webhook_url", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Must be a valid URL",
                    },
                  })}
                />
                {errors.webhook_url && (
                  <FormControl.Error>
                    {errors.webhook_url.message}
                  </FormControl.Error>
                )}
                <FormControl.Helper>
                  Optional: Webhook URL for this payment method
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
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PaymentMethodEditModal;
