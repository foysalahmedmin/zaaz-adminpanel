import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createFeatureEndpoint } from "@/services/feature-endpoint.service";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FeatureEndpointAddModalProps = {
  default?: Partial<TFeatureEndpoint>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  featureId: string;
  className?: string;
  mutationKey?: string[];
};

const FeatureEndpointAddModal: React.FC<FeatureEndpointAddModalProps> = ({
  isOpen,
  setIsOpen,
  default: endpoint,
  featureId,
  mutationKey: key = ["feature-endpoints"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TFeatureEndpoint>>({
    defaultValues: {
      feature: featureId,
      name: endpoint?.name || "",
      value: endpoint?.value || "",
      description: endpoint?.description || "",
      endpoint: endpoint?.endpoint || "",
      method: endpoint?.method || "GET",
      min_credits: endpoint?.min_credits || 0,
      sequence: endpoint?.sequence || 0,
      is_active: endpoint?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: createFeatureEndpoint,
    onSuccess: (data) => {
      toast.success(data?.message || "Feature Endpoint created successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to create feature endpoint",
      );
    },
  });

  const onSubmit = (data: Partial<TFeatureEndpoint>) => {
    mutation.mutate({
      ...data,
      feature: featureId,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Feature Endpoint</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Endpoint name"
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
                  placeholder="endpoint-value"
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
                  placeholder="Endpoint description"
                  {...register("description")}
                />
              </div>

              <div>
                <FormControl.Label>Endpoint</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="/api/v1/endpoint"
                  {...register("endpoint", {
                    required: "Endpoint is required",
                  })}
                />
                {errors.endpoint && (
                  <FormControl.Error>
                    {errors.endpoint.message}
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Method</FormControl.Label>
                <FormControl
                  as="select"
                  className="border-input bg-card w-full rounded-md border px-3 py-2 text-sm"
                  {...register("method", { required: "Method is required" })}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </FormControl>
                {errors.method && (
                  <FormControl.Error>{errors.method.message}</FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Minimum Credits Amount</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("min_credits", {
                    required: "Minimum Credits Amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Minimum Credits Amount must be 0 or greater",
                    },
                  })}
                />
                {errors.min_credits && (
                  <FormControl.Error>
                    {errors.min_credits.message}
                  </FormControl.Error>
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

export default FeatureEndpointAddModal;
