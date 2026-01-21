import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createCoupon } from "@/services/coupon.service";
import { fetchPackages } from "@/services/package.service";
import type { TCoupon } from "@/types/coupon.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CouponAddModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const CouponAddModal: React.FC<CouponAddModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();

  const { data: packagesData } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackages({ is_active: true, sort: "name" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<Partial<TCoupon>>({
    defaultValues: {
      discount_type: "percentage",
      discount_value: 0,
      fixed_amount: { USD: 0, BDT: 0 },
      min_purchase_amount: { USD: 0, BDT: 0 },
      max_discount_amount: { USD: 0, BDT: 0 },
      valid_from: new Date().toISOString().split("T")[0],
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      usage_limit: 0,
      applicable_packages: [],
      is_active: true,
    },
  });

  const discountType = watch("discount_type");

  const mutation = useMutation({
    mutationFn: (data: Partial<TCoupon>) => createCoupon(data),
    onSuccess: (data) => {
      toast.success(data?.message || "Coupon created successfully!");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    },
  });

  const onSubmit = (data: Partial<TCoupon>) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Add Coupon</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Coupon Code</FormControl.Label>
                  <FormControl
                    type="text"
                    placeholder="e.g. SAVE50"
                    {...register("code", { required: "Code is required" })}
                  />
                  {errors.code && (
                    <FormControl.Error>{errors.code.message}</FormControl.Error>
                  )}
                </div>
                <div>
                  <FormControl.Label>Discount Type</FormControl.Label>
                  <FormControl as="select" {...register("discount_type")}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </FormControl>
                </div>
              </div>

              {discountType === "percentage" ? (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <FormControl.Label>Percentage (%)</FormControl.Label>
                    <FormControl
                      type="number"
                      placeholder="0"
                      {...register("discount_value", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <FormControl.Label>Max Discount (USD)</FormControl.Label>
                    <FormControl
                      type="number"
                      placeholder="0"
                      {...register("max_discount_amount.USD", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div>
                    <FormControl.Label>Max Discount (BDT)</FormControl.Label>
                    <FormControl
                      type="number"
                      placeholder="0"
                      {...register("max_discount_amount.BDT", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormControl.Label>Amount (USD)</FormControl.Label>
                    <FormControl
                      type="number"
                      placeholder="0"
                      {...register("fixed_amount.USD", { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <FormControl.Label>Amount (BDT)</FormControl.Label>
                    <FormControl
                      type="number"
                      placeholder="0"
                      {...register("fixed_amount.BDT", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Min Purchase (USD)</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0"
                    {...register("min_purchase_amount.USD", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <div>
                  <FormControl.Label>Min Purchase (BDT)</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0"
                    {...register("min_purchase_amount.BDT", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Valid From</FormControl.Label>
                  <FormControl type="date" {...register("valid_from")} />
                </div>
                <div>
                  <FormControl.Label>Valid Until</FormControl.Label>
                  <FormControl type="date" {...register("valid_until")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>
                    Usage Limit (0 for unlimited)
                  </FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0"
                    {...register("usage_limit", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <FormControl.Label>Status</FormControl.Label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      className="accent-accent size-5"
                      {...register("is_active")}
                    />
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
              </div>

              <div>
                <FormControl.Label>
                  Applicable Packages (None = All)
                </FormControl.Label>
                <div className="border-input bg-card max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                  {packagesData?.data?.map((pkg) => (
                    <label
                      key={pkg._id}
                      className="flex flex-row items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        value={pkg._id}
                        className="accent-accent size-4"
                        {...register("applicable_packages")}
                      />
                      <span className="text-sm font-medium">{pkg.name}</span>
                    </label>
                  ))}
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
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Coupon
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CouponAddModal;
