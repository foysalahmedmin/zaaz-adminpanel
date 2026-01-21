import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { updateBillingSetting } from "@/services/billing-setting.service";
import type { TBillingSetting } from "@/types/billing-setting.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type BillingSettingEditModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  default: TBillingSetting;
  mutationKey?: string[];
};

type TFormInput = Partial<TBillingSetting>;

const BillingSettingEditModal: React.FC<BillingSettingEditModalProps> = ({
  isOpen,
  setIsOpen,
  default: defaultData,
  mutationKey: key = ["billing-settings"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>({
    defaultValues: {
      ...defaultData,
    },
  });

  useEffect(() => {
    if (isOpen && defaultData) {
      reset({
        ...defaultData,
        applied_at: defaultData.applied_at
          ? new Date(defaultData.applied_at).toISOString().slice(0, 16)
          : undefined,
      });
    }
  }, [isOpen, defaultData, reset]);

  const mutation = useMutation({
    mutationFn: (data: TFormInput) =>
      updateBillingSetting(defaultData._id, data),
    onSuccess: (data) => {
      toast.success(data?.message || "Billing Setting updated successfully!");
      queryClient.invalidateQueries({ queryKey: key });
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to update Billing Setting",
      );
    },
  });

  const onSubmit = (data: TFormInput) => {
    mutation.mutate({
      ...data,
      credit_price: Number(data.credit_price),
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-lg overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Edit Billing Setting</Modal.Title>
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
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default BillingSettingEditModal;
