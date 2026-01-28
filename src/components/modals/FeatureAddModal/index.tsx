import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createFeature } from "@/services/feature.service";
import type { TFeature } from "@/types/feature.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FeatureAddModalProps = {
  default?: Partial<TFeature>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const FeatureAddModal: React.FC<FeatureAddModalProps> = ({
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
      value: feature?.value || "",
      description: feature?.description || "",
      path: feature?.path || "",
      prefix: feature?.prefix || "",
      type: feature?.type || "other",
      sequence: feature?.sequence || 0,
      is_active: feature?.is_active ?? true,
      parent: feature?.parent || null,
    },
  });

  const mutation = useMutation({
    mutationFn: createFeature,
    onSuccess: (data) => {
      toast.success(data?.message || "Feature created successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create feature");
    },
  });

  const onSubmit = (data: Partial<TFeature>) => {
    mutation.mutate({
      ...data,
      parent: data.parent || undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Feature</Modal.Title>
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
                <FormControl.Label>Value</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="feature-value"
                  {...register("value", {
                    required: "Value is required",
                    minLength: {
                      value: 2,
                      message: "Value must be at least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Value cannot exceed 100 characters",
                    },
                    pattern: {
                      value: /^[a-z0-9-_]+$/,
                      message:
                        "Value must contain only lowercase letters, numbers, hyphens, and underscores",
                    },
                  })}
                />
                {errors.value && (
                  <FormControl.Error>{errors.value.message}</FormControl.Error>
                )}
                <FormControl.Helper>
                  Unique identifier (lowercase, alphanumeric with
                  hyphens/underscores). Will be automatically converted to
                  lowercase.
                </FormControl.Helper>
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
                Create
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default FeatureAddModal;
