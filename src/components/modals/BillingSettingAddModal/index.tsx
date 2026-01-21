import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createBillingSetting } from "@/services/billing-setting.service";
import type { TBillingSetting } from "@/types/billing-setting.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type BillingSettingAddModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mutationKey?: string[];
};

type TFormInput = Partial<TBillingSetting>;

const BillingSettingAddModal: React.FC<BillingSettingAddModalProps> = ({
  isOpen,
  setIsOpen,
  mutationKey: key = ["billing-settings"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>();

  const mutation = useMutation({
    mutationFn: createBillingSetting,
    onSuccess: (data) => {
      toast.success(data?.message || "Billing Setting created successfully!");
      queryClient.invalidateQueries({ queryKey: key });
      setIsOpen(false);
      reset();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to create Billing Setting",
      );
    },
  });

  const onSubmit = (data: TFormInput) => {
    mutation.mutate({
      ...data,
      credit_price: Number(data.credit_price),
      currency: "USD",
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-lg overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Add Billing Setting</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Credit Price (USD)</FormControl.Label>
                <FormControl
                  type="number"
                  step="0.000001"
                  min="0"
                  {...register("credit_price", {
                    required: "Credit price is required",
                    min: { value: 0, message: "Must be non-negative" },
                  })}
                />
                {errors.credit_price && (
                  <FormControl.Error>
                    {errors.credit_price.message}
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Status</FormControl.Label>
                <select
                  className="border-input hover:bg-accent hover:text-accent-foreground placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-transparent focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("status")}
                  defaultValue="active"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <FormControl.Label>Applied At</FormControl.Label>
                <FormControl
                  type="datetime-local"
                  {...register("applied_at")}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    {...register("is_initial")}
                  />
                  <span className="text-sm font-medium">Is Initial</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    {...register("is_active")}
                    defaultChecked
                  />
                  <span className="text-sm font-medium">Is Active</span>
                </label>
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
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default BillingSettingAddModal;
