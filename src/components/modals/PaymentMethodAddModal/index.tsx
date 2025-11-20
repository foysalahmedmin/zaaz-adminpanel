import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createPaymentMethod } from "@/services/payment-method.service";
import type { TPaymentMethod } from "@/types/payment-method.type";
import type { ErrorResponse } from "@/types/response.type";
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
  } = useForm<Partial<TPaymentMethod>>({
    defaultValues: {
      name: paymentMethod?.name || "",
      value: paymentMethod?.value || "",
      currency: paymentMethod?.currency || "USD",
      description: paymentMethod?.description || "",
      secret: paymentMethod?.secret || "",
      public_key: paymentMethod?.public_key || "",
      webhook_url: paymentMethod?.webhook_url || "",
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
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to create payment method",
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
            <Modal.Title>Add Payment Method</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name *</FormControl.Label>
                <FormControl
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                  placeholder="e.g., Stripe, SSL Commerz"
                  error={errors.name?.message}
                />
              </div>

              <div>
                <FormControl.Label>Value *</FormControl.Label>
                <FormControl
                  {...register("value", {
                    required: "Value is required",
                    minLength: {
                      value: 2,
                      message: "Value must be at least 2 characters",
                    },
                  })}
                  placeholder="e.g., stripe, sslcommerz"
                  error={errors.value?.message}
                />
                <FormControl.Hint>
                  Lowercase identifier for the payment method
                </FormControl.Hint>
              </div>

              <div>
                <FormControl.Label>Currency *</FormControl.Label>
                <FormControl.Select
                  {...register("currency", {
                    required: "Currency is required",
                  })}
                  error={errors.currency?.message}
                >
                  <option value="USD">USD</option>
                  <option value="BDT">BDT</option>
                </FormControl.Select>
              </div>

              <div>
                <FormControl.Label>Secret *</FormControl.Label>
                <FormControl
                  {...register("secret", {
                    required: "Secret is required",
                  })}
                  type="password"
                  placeholder="Enter secret key"
                  error={errors.secret?.message}
                />
              </div>

              <div>
                <FormControl.Label>Public Key</FormControl.Label>
                <FormControl
                  {...register("public_key")}
                  placeholder="Enter public key (optional)"
                  error={errors.public_key?.message}
                />
              </div>

              <div>
                <FormControl.Label>Description</FormControl.Label>
                <FormControl.Textarea
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                  placeholder="Enter description (optional)"
                  rows={3}
                  error={errors.description?.message}
                />
              </div>

              <div>
                <FormControl.Label>Webhook URL</FormControl.Label>
                <FormControl
                  {...register("webhook_url", {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Must be a valid URL",
                    },
                  })}
                  type="url"
                  placeholder="https://example.com/webhook"
                  error={errors.webhook_url?.message}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <FormControl.Checkbox
                    {...register("is_test")}
                    id="is_test"
                  />
                  <FormControl.Label htmlFor="is_test" className="font-normal">
                    Test Mode
                  </FormControl.Label>
                </div>
                <div className="flex items-center gap-2">
                  <FormControl.Checkbox
                    {...register("is_active")}
                    id="is_active"
                  />
                  <FormControl.Label htmlFor="is_active" className="font-normal">
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

