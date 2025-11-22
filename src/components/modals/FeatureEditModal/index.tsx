import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { updateFeature } from "@/services/feature.service";
import type { TFeature } from "@/types/feature.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FeatureEditModalProps = {
  default: Partial<TFeature>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const FeatureEditModal: React.FC<FeatureEditModalProps> = ({
  isOpen,
  setIsOpen,
  default: feature,
  mutationKey: key = ["features"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TFeature>>({
    defaultValues: {
      name: feature?.name || "",
      description: feature?.description || "",
      path: feature?.path || "",
      prefix: feature?.prefix || "",
      type: feature?.type || "other",
      sequence: feature?.sequence || 0,
      is_active: feature?.is_active ?? true,
      parent: feature?.parent || null,
    },
  });

  React.useEffect(() => {
    reset({
      name: feature?.name || "",
      description: feature?.description || "",
      path: feature?.path || "",
      prefix: feature?.prefix || "",
      type: feature?.type || "other",
      sequence: feature?.sequence || 0,
      is_active: feature?.is_active ?? true,
      parent: feature?.parent || null,
    });
  }, [feature, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<TFeature>) => {
      if (!feature._id) {
        throw new Error("Feature ID is missing");
      }
      return updateFeature(feature._id, data);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Feature updated successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to update feature");
    },
  });

  const onSubmit = (data: Partial<TFeature>) => {
    const updatedFields = Object.entries(data).reduce<Partial<TFeature>>(
      (acc, [key, value]) => {
        const fieldKey = key as keyof TFeature;
        if (value !== feature[fieldKey]) {
          (acc as Record<string, unknown>)[fieldKey] = value;
        }
        return acc;
      },
      {},
    );

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected");
      return;
    }

    mutation.mutate({
      ...updatedFields,
      parent: updatedFields.parent || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Feature</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Feature name"
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
                  placeholder="Feature description"
                  {...register("description")}
                />
              </div>

              <div>
                <FormControl.Label>Path (Optional)</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="/feature-path"
                  {...register("path")}
                />
                <FormControl.Helper>
                  Frontend route path for this feature.
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Prefix (Optional)</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="api/v1/feature"
                  {...register("prefix")}
                />
                <FormControl.Helper>
                  API namespace prefix for this feature.
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Type</FormControl.Label>
                <FormControl
                  as="select"
                  className="border-input bg-card w-full rounded-md border px-3 py-2 text-sm"
                  {...register("type")}
                >
                  <option value="writing">Writing</option>
                  <option value="generation">Generation</option>
                  <option value="other">Other</option>
                </FormControl>
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

export default FeatureEditModal;
