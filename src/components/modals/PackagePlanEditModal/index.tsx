import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { fetchPackages } from "@/services/package.service";
import { fetchPlans } from "@/services/plan.service";
import { updatePackagePlan } from "@/services/package-plan.service";
import type { TPackagePlan } from "@/types/package-plan.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PackagePlanEditModalProps = {
  default: Partial<TPackagePlan>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const PackagePlanEditModal: React.FC<PackagePlanEditModalProps> = ({
  isOpen,
  setIsOpen,
  default: packagePlan,
  mutationKey: key = ["package-plans"],
}) => {
  const queryClient = useQueryClient();

  const { data: packagesData } = useQuery({
    queryKey: ["packages"],
    queryFn: () => fetchPackages({ is_active: true, sort: "name" }),
  });

  const { data: plansData } = useQuery({
    queryKey: ["plans"],
    queryFn: () => fetchPlans({ is_active: true, sort: "name" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TPackagePlan>>({
    defaultValues: {
      package:
        packagePlan?.package ||
        (typeof packagePlan?.package === "object"
          ? packagePlan?.package?._id || ""
          : ""),
      plan:
        packagePlan?.plan ||
        (typeof packagePlan?.plan === "object"
          ? packagePlan?.plan?._id || ""
          : ""),
      price: packagePlan?.price || { USD: 0, BDT: 0 },
      token: packagePlan?.token || 0,
      is_initial: packagePlan?.is_initial || false,
      is_active: packagePlan?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    reset({
      package:
        typeof packagePlan?.package === "string"
          ? packagePlan.package
          : typeof packagePlan?.package === "object" && packagePlan?.package
            ? (packagePlan.package as any)?._id || ""
            : "",
      plan:
        typeof packagePlan?.plan === "string"
          ? packagePlan.plan
          : typeof packagePlan?.plan === "object" && packagePlan?.plan
            ? (packagePlan.plan as any)?._id || ""
            : "",
      price: packagePlan?.price || { USD: 0, BDT: 0 },
      token: packagePlan?.token || 0,
      is_initial: packagePlan?.is_initial || false,
      is_active: packagePlan?.is_active ?? true,
    });
  }, [packagePlan, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<TPackagePlan>) => {
      if (!packagePlan._id) {
        throw new Error("Package Plan ID is missing");
      }
      return updatePackagePlan(packagePlan._id, data);
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Package Plan updated successfully!",
      );
      queryClient.invalidateQueries({ queryKey: key || [] });
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to update package plan",
      );
    },
  });

  const onSubmit = (data: Partial<TPackagePlan>) => {
    if (!data.package) {
      toast.error("Package is required");
      return;
    }
    if (!data.plan) {
      toast.error("Plan is required");
      return;
    }

    const updatedFields: Partial<TPackagePlan> = {};

    const currentPackage =
      typeof packagePlan.package === "object" && packagePlan.package
        ? (packagePlan.package as any)?._id || ""
        : typeof packagePlan.package === "string"
          ? packagePlan.package
          : "";
    const currentPlan =
      typeof packagePlan.plan === "object"
        ? packagePlan.plan?._id || ""
        : packagePlan.plan || "";

    if (data.package !== currentPackage) updatedFields.package = data.package;
    if (data.plan !== currentPlan) updatedFields.plan = data.plan;
    if (
      JSON.stringify(data.price) !== JSON.stringify(packagePlan.price)
    ) {
      updatedFields.price = data.price;
    }
    if (data.token !== packagePlan.token) updatedFields.token = data.token;
    if (data.is_initial !== packagePlan.is_initial)
      updatedFields.is_initial = data.is_initial;
    if (data.is_active !== packagePlan.is_active)
      updatedFields.is_active = data.is_active;

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected");
      return;
    }

    mutation.mutate(updatedFields);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>Edit Package Plan</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Package *</FormControl.Label>
                <FormControl
                  as="select"
                  {...register("package", { required: "Package is required" })}
                >
                  <option value="">Select a package</option>
                  {packagesData?.data?.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name}
                    </option>
                  ))}
                </FormControl>
                {errors.package && (
                  <FormControl.Error>
                    {errors.package.message}
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Plan *</FormControl.Label>
                <FormControl
                  as="select"
                  {...register("plan", { required: "Plan is required" })}
                >
                  <option value="">Select a plan</option>
                  {plansData?.data?.map((plan) => (
                    <option key={plan._id} value={plan._id}>
                      {plan.name} ({plan.duration} days)
                    </option>
                  ))}
                </FormControl>
                {errors.plan && (
                  <FormControl.Error>{errors.plan.message}</FormControl.Error>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Price (USD) *</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    {...register("price.USD", {
                      required: "Price USD is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price must be 0 or greater",
                      },
                    })}
                  />
                  {errors.price?.USD && (
                    <FormControl.Error>
                      {errors.price.USD.message}
                    </FormControl.Error>
                  )}
                </div>
                <div>
                  <FormControl.Label>Price (BDT) *</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    {...register("price.BDT", {
                      required: "Price BDT is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Price must be 0 or greater",
                      },
                    })}
                  />
                  {errors.price?.BDT && (
                    <FormControl.Error>
                      {errors.price.BDT.message}
                    </FormControl.Error>
                  )}
                </div>
              </div>

              <div>
                <FormControl.Label>Token *</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("token", {
                    required: "Token is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Token must be 0 or greater",
                    },
                  })}
                />
                {errors.token && (
                  <FormControl.Error>{errors.token.message}</FormControl.Error>
                )}
              </div>

              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    {...register("is_initial")}
                  />
                  <span className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Initial Plan
                  </span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    {...register("is_active")}
                  />
                  <span className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Active
                  </span>
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
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PackagePlanEditModal;

