import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createFeatureEndpoint } from "@/services/feature-endpoint.service";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import type { ErrorResponse } from "@/types/response.type";
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
    setValue,
    formState: { errors },
  } = useForm<Partial<TFeatureEndpoint>>({
    defaultValues: {
      value: endpoint?.value || "",
      feature: featureId,
      name: endpoint?.name || "",
      description: endpoint?.description || "",
      endpoint: endpoint?.endpoint || "",
      method: endpoint?.method || "GET",
      token: endpoint?.token || 0,
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
    onError: (error: AxiosError<ErrorResponse>) => {
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
                <FormControl.Label>Value</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="endpoint-value"
                  {...register("value", {
                    required: "Value is required",
                    pattern: {
                      value: /^[a-z0-9-_]+$/,
                      message:
                        "Value must contain only lowercase letters, numbers, hyphens, and underscores",
                    },
                  })}
                  onChange={(e) => {
                    const lowerValue = e.target.value.toLowerCase().trim();
                    setValue("value", lowerValue, { shouldValidate: true });
                  }}
                />
                {errors.value && (
                  <FormControl.Error>{errors.value.message}</FormControl.Error>
                )}
                <FormControl.Helper>
                  Unique identifier for this endpoint (lowercase, alphanumeric,
                  hyphens, underscores only)
                </FormControl.Helper>
              </div>

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
                <FormControl.Label>Minimum Token Amount</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("token", {
                    required: "Minimum Token Amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Minimum Token Amount must be 0 or greater",
                    },
                  })}
                />
                {errors.token && (
                  <FormControl.Error>{errors.token.message}</FormControl.Error>
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
