import BlockNoteEditor from "@/components/ui/BlockNoteEditor";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { fetchFeatures } from "@/services/feature.service";
import { updatePackage } from "@/services/package.service";
import type { TPackage } from "@/types/package.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PackageEditModalProps = {
  default: Partial<TPackage>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const PackageEditModal: React.FC<PackageEditModalProps> = ({
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

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Partial<TPackage> & { priceUSD: number; priceBDT: number }>({
    defaultValues: {
      name: pkg?.name || "",
      description: pkg?.description || "",
      content: pkg?.content || "",
      token: pkg?.token || 0,
      features: pkg?.features || [],
      duration: pkg?.duration || undefined,
      priceUSD: pkg?.price?.USD || 0,
      priceBDT: pkg?.price?.BDT || 0,
      is_active: pkg?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    reset({
      name: pkg?.name || "",
      description: pkg?.description || "",
      content: pkg?.content || "",
      token: pkg?.token || 0,
      features: pkg?.features || [],
      duration: pkg?.duration || undefined,
      priceUSD: pkg?.price?.USD || 0,
      priceBDT: pkg?.price?.BDT || 0,
      is_active: pkg?.is_active ?? true,
    });
  }, [pkg, reset]);

  const selectedFeatures = watch("features") || [];

  const mutation = useMutation({
    mutationFn: (data: Partial<TPackage>) => {
      if (!pkg._id) {
        throw new Error("Package ID is missing");
      }
      return updatePackage(pkg._id, data);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Package updated successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update package");
    },
  });

  const onSubmit = (
    data: Partial<TPackage> & { priceUSD: number; priceBDT: number },
  ) => {
    const updatedFields: Partial<TPackage> = {};

    if (data.name !== pkg.name) updatedFields.name = data.name;
    if (data.description !== pkg.description)
      updatedFields.description = data.description;
    if (data.content !== pkg.content) updatedFields.content = data.content;
    if (data.token !== pkg.token) updatedFields.token = data.token;
    if (JSON.stringify(data.features) !== JSON.stringify(pkg.features)) {
      updatedFields.features = data.features;
    }
    if (data.duration !== pkg.duration) updatedFields.duration = data.duration;
    if (data.priceUSD !== pkg.price?.USD || data.priceBDT !== pkg.price?.BDT) {
      updatedFields.price = {
        USD: data.priceUSD,
        BDT: data.priceBDT,
      };
    }
    if (data.is_active !== pkg.is_active)
      updatedFields.is_active = data.is_active;

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected");
      return;
    }

    mutation.mutate(updatedFields);
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
        <Modal.Content className="max-w-2xl">
          <Modal.Header>
            <Modal.Title>Edit Package</Modal.Title>
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

              <div>
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
                <FormControl.Label>Token</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("token", {
                    required: "Token is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Token must be 0 or greater" },
                  })}
                />
                {errors.token && (
                  <FormControl.Error>{errors.token.message}</FormControl.Error>
                )}
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
                  Duration (Optional, in days)
                </FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="30"
                  min="1"
                  {...register("duration", {
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Duration must be at least 1 day",
                    },
                  })}
                />
                {errors.duration && (
                  <FormControl.Error>
                    {errors.duration.message}
                  </FormControl.Error>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Price (USD)</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    {...register("priceUSD", {
                      required: "Price USD is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Price must be 0 or greater" },
                    })}
                  />
                  {errors.priceUSD && (
                    <FormControl.Error>
                      {errors.priceUSD.message}
                    </FormControl.Error>
                  )}
                </div>

                <div>
                  <FormControl.Label>Price (BDT)</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    {...register("priceBDT", {
                      required: "Price BDT is required",
                      valueAsNumber: true,
                      min: { value: 0, message: "Price must be 0 or greater" },
                    })}
                  />
                  {errors.priceBDT && (
                    <FormControl.Error>
                      {errors.priceBDT.message}
                    </FormControl.Error>
                  )}
                </div>
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
                Update
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PackageEditModal;
