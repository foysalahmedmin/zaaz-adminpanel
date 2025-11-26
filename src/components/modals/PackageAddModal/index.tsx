import BlockNoteEditor from "@/components/ui/BlockNoteEditor";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { fetchFeatures } from "@/services/feature.service";
import { createPackage } from "@/services/package.service";
import { fetchPlans } from "@/services/plan.service";
import type { TPackage } from "@/types/package.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Plus, X } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PackageAddModalProps = {
  default?: Partial<TPackage>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

type PackagePlanFormData = {
  plan: string;
  priceUSD: number;
  priceBDT: number;
  token: number;
  is_initial: boolean;
  is_active: boolean;
};

type TPackageFormInput = Partial<TPackage> & {
  packagePlans: PackagePlanFormData[];
};

// Points Input Component
type PointsInputProps = {
  value?: string[];
  onChange: (value: string[]) => void;
};

const PointsInput: React.FC<PointsInputProps> = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = React.useState("");

  const handleAddPoint = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      if (!value.includes(trimmedValue)) {
        onChange([...value, trimmedValue]);
        setInputValue("");
      }
    }
  };

  const handleRemovePoint = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPoint();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <FormControl
          type="text"
          placeholder="Enter a point and press Enter or click +"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          className="size-10"
          type="button"
          variant="outline"
          size="sm"
          shape="icon"
          onClick={handleAddPoint}
          disabled={!inputValue.trim()}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      {value && value.length > 0 && (
        <div className="border-input bg-card space-y-2 rounded-md border p-3">
          {value.map((point) => (
            <div
              key={point}
              className="bg-muted/50 flex items-center justify-between gap-2 rounded px-3 py-2"
            >
              <span className="text-sm">{point}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePoint(value.indexOf(point))}
                className="text-destructive hover:text-destructive h-6 w-6 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PackageAddModal: React.FC<PackageAddModalProps> = ({
  isOpen,
  setIsOpen,
  default: pkg,
  mutationKey: key = ["packages"],
}) => {
  const queryClient = useQueryClient();

  const { data: featuresData } = useQuery({
    queryKey: ["features"],
    queryFn: () => fetchFeatures({ sort: "name" }),
  });

  const { data: plansData } = useQuery({
    queryKey: ["plans"],
    queryFn: () => fetchPlans({ is_active: true, sort: "name" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<TPackageFormInput>({
    defaultValues: {
      name: pkg?.name || "",
      description: pkg?.description || "",
      content: pkg?.content || "",
      type: pkg?.type || "token",
      badge: pkg?.badge || "",
      points: pkg?.points || [],
      features: pkg?.features || [],
      packagePlans:
        pkg?.plans?.map((pp: any) => ({
          plan: pp.plan?._id || pp.plan || "",
          priceUSD: pp.price?.USD || 0,
          priceBDT: pp.price?.BDT || 0,
          token: pp.token || 0,
          is_initial: pp.is_initial || false,
          is_active: pp.is_active !== undefined ? pp.is_active : true,
        })) || [],
      sequence: pkg?.sequence || 0,
      is_active: pkg?.is_active ?? true,
    },
  });

  const selectedFeatures = watch("features") || [];
  const packagePlans = watch("packagePlans") || [];

  const mutation = useMutation({
    mutationFn: (data: TPackageFormInput) => {
      const payload: any = {
        name: data.name,
        description: data.description,
        content: data.content,
        type: data.type,
        badge: data.badge,
        points: data.points,
        features: data.features,
        plans: data.packagePlans.map((pp) => ({
          plan: pp.plan,
          price: {
            USD: pp.priceUSD,
            BDT: pp.priceBDT,
          },
          token: pp.token,
          is_initial: pp.is_initial,
          is_active: pp.is_active,
        })),
        sequence: data.sequence,
        is_active: data.is_active,
      };
      return createPackage(payload);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Package created successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create package");
    },
  });

  const onSubmit = (data: TPackageFormInput) => {
    if (!data.packagePlans || data.packagePlans.length === 0) {
      toast.error("At least one plan is required");
      return;
    }

    // Ensure at least one is_initial
    const hasInitial = data.packagePlans.some((pp) => pp.is_initial);
    if (!hasInitial) {
      data.packagePlans[0].is_initial = true;
    }

    // Ensure only one is_initial
    const initialCount = data.packagePlans.filter((pp) => pp.is_initial).length;
    if (initialCount > 1) {
      toast.error("Only one plan can be marked as 'Initial'.");
      return;
    }

    mutation.mutate(data);
  };

  const togglePlan = (planId: string) => {
    const current = packagePlans;
    const existingIndex = current.findIndex((pp) => pp.plan === planId);

    if (existingIndex >= 0) {
      // Remove plan
      setValue(
        "packagePlans",
        current.filter((_, i) => i !== existingIndex),
      );
    } else {
      // Add plan with default values
      const plan = plansData?.data?.find((p) => p._id === planId);
      if (plan) {
        setValue("packagePlans", [
          ...current,
          {
            plan: planId,
            priceUSD: 0,
            priceBDT: 0,
            token: 0,
            is_initial: current.length === 0, // First plan is initial
            is_active: true,
          },
        ]);
      }
    }
  };

  const toggleFeature = (featureId: string) => {
    const current = selectedFeatures;
    if (current.includes(featureId)) {
      setValue(
        "features",
        current.filter((id) => id !== featureId),
      );
    } else {
      setValue("features", [...current, featureId]);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Add Package</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Package name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FormControl.Error>{errors.name.message}</FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Description (Optional)</FormControl.Label>
                <FormControl
                  as="textarea"
                  className="h-auto min-h-20 py-2"
                  placeholder="Package description"
                  {...register("description")}
                />
              </div>

              <div className="hidden">
                <FormControl.Label>Content (Optional)</FormControl.Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <BlockNoteEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <FormControl.Label>Type</FormControl.Label>
                <FormControl as="select" {...register("type")}>
                  <option value="token">Token</option>
                  <option value="subscription">Subscription</option>
                </FormControl>
                <FormControl.Helper>
                  Select package type (default: token)
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Badge (Optional)</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g., Popular, Best Value, New"
                  {...register("badge")}
                />
                <FormControl.Helper>
                  Badge text to display on package card
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Points (Optional)</FormControl.Label>
                <FormControl.Helper>
                  Add key points/benefits one by one
                </FormControl.Helper>
                <Controller
                  name="points"
                  control={control}
                  render={({ field }) => (
                    <PointsInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <FormControl.Label>Features</FormControl.Label>
                <div className="border-input bg-card max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                  {featuresData?.data?.map((feature) => (
                    <label
                      key={feature._id}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFeatures.includes(feature._id)}
                        onChange={() => toggleFeature(feature._id)}
                        className="accent-accent size-4"
                      />
                      <span className="text-sm">{feature.name}</span>
                    </label>
                  ))}
                </div>
                {selectedFeatures.length === 0 && (
                  <FormControl.Error>
                    At least one feature is required
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>
                  Plans (Required - At least one)
                </FormControl.Label>
                <FormControl.Helper>
                  Select plans and configure their prices, tokens, and settings.
                </FormControl.Helper>
                <div className="border-input bg-card max-h-68 space-y-3 overflow-y-auto rounded-md border p-3">
                  {plansData?.data?.map((plan) => {
                    const planData = packagePlans.find(
                      (pp) => pp.plan === plan._id,
                    );
                    const isSelected = !!planData;

                    return (
                      <div
                        key={plan._id}
                        className={`space-y-3 rounded-lg border p-3 ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => togglePlan(plan._id)}
                            className="accent-accent size-4"
                          />
                          <span className="font-semibold">
                            {plan.name} ({plan.duration} days)
                          </span>
                        </label>

                        {isSelected && planData && (
                          <div className="ml-6 grid gap-3 border-t pt-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <FormControl.Label>
                                  Price (USD) *
                                </FormControl.Label>
                                <FormControl
                                  type="number"
                                  placeholder="0.00"
                                  min="0"
                                  step="0.01"
                                  value={planData.priceUSD}
                                  onChange={(e) => {
                                    const updated = [...packagePlans];
                                    const index = updated.findIndex(
                                      (pp) => pp.plan === plan._id,
                                    );
                                    if (index >= 0) {
                                      updated[index].priceUSD =
                                        parseFloat(e.target.value) || 0;
                                      setValue("packagePlans", updated);
                                    }
                                  }}
                                />
                              </div>
                              <div>
                                <FormControl.Label>
                                  Price (BDT) *
                                </FormControl.Label>
                                <FormControl
                                  type="number"
                                  placeholder="0.00"
                                  min="0"
                                  step="0.01"
                                  value={planData.priceBDT}
                                  onChange={(e) => {
                                    const updated = [...packagePlans];
                                    const index = updated.findIndex(
                                      (pp) => pp.plan === plan._id,
                                    );
                                    if (index >= 0) {
                                      updated[index].priceBDT =
                                        parseFloat(e.target.value) || 0;
                                      setValue("packagePlans", updated);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <FormControl.Label>Token *</FormControl.Label>
                              <FormControl
                                type="number"
                                placeholder="0"
                                min="0"
                                value={planData.token}
                                onChange={(e) => {
                                  const updated = [...packagePlans];
                                  const index = updated.findIndex(
                                    (pp) => pp.plan === plan._id,
                                  );
                                  if (index >= 0) {
                                    updated[index].token =
                                      parseInt(e.target.value) || 0;
                                    setValue("packagePlans", updated);
                                  }
                                }}
                              />
                            </div>

                            <div className="flex items-center gap-4">
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={planData.is_initial}
                                  onChange={(e) => {
                                    const updated = [...packagePlans];
                                    const index = updated.findIndex(
                                      (pp) => pp.plan === plan._id,
                                    );
                                    if (index >= 0) {
                                      // Unset other initial plans
                                      updated.forEach((pp, i) => {
                                        pp.is_initial =
                                          i === index
                                            ? e.target.checked
                                            : false;
                                      });
                                      setValue("packagePlans", updated);
                                    }
                                  }}
                                  className="accent-accent size-4"
                                />
                                <span className="text-sm font-medium">
                                  Initial Plan
                                </span>
                              </label>
                              <label className="inline-flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={planData.is_active}
                                  onChange={(e) => {
                                    const updated = [...packagePlans];
                                    const index = updated.findIndex(
                                      (pp) => pp.plan === plan._id,
                                    );
                                    if (index >= 0) {
                                      updated[index].is_active =
                                        e.target.checked;
                                      setValue("packagePlans", updated);
                                    }
                                  }}
                                  className="accent-accent size-4"
                                />
                                <span className="text-sm font-medium">
                                  Active
                                </span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {packagePlans.length === 0 && (
                  <FormControl.Error>
                    At least one plan is required
                  </FormControl.Error>
                )}
                {plansData?.data?.length === 0 && (
                  <FormControl.Helper>
                    No active plans available. Create plans first.
                  </FormControl.Helper>
                )}
              </div>

              <div>
                <FormControl.Label>Sequence</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("sequence", {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Sequence must be 0 or greater",
                    },
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

              <div>
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
                Create
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PackageAddModal;
