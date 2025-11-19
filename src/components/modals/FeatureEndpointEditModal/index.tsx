import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { updateFeatureEndpoint } from "@/services/feature-endpoint.service";
import type { TFeatureEndpoint } from "@/types/feature-endpoint.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FeatureEndpointEditModalProps = {
  default: Partial<TFeatureEndpoint>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const FeatureEndpointEditModal: React.FC<FeatureEndpointEditModalProps> = ({
  isOpen,
  setIsOpen,
  default: endpoint,
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
      name: endpoint?.name || "",
      description: endpoint?.description || "",
      endpoint: endpoint?.endpoint || "",
      method: endpoint?.method || "GET",
      token: endpoint?.token || 0,
      is_active: endpoint?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    reset({
      name: endpoint?.name || "",
      description: endpoint?.description || "",
      endpoint: endpoint?.endpoint || "",
      method: endpoint?.method || "GET",
      token: endpoint?.token || 0,
      is_active: endpoint?.is_active ?? true,
    });
  }, [endpoint, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<TFeatureEndpoint>) => {
      if (!endpoint._id) {
        throw new Error("Feature Endpoint ID is missing");
      }
      return updateFeatureEndpoint(endpoint._id, data);
    },
    onSuccess: (data) => {
      toast.success(
        data?.message || "Feature Endpoint updated successfully!",
      );
      queryClient.invalidateQueries({ queryKey: key || [] });
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to update feature endpoint",
      );
      console.error("Update Feature Endpoint Error:", error);
    },
  });

  const onSubmit = (data: Partial<TFeatureEndpoint>) => {
    const updatedFields = Object.entries(data).reduce<
      Partial<TFeatureEndpoint>
    >((acc, [key, value]) => {
      const fieldKey = key as keyof TFeatureEndpoint;
      if (value !== endpoint[fieldKey]) {
        (acc as Record<string, unknown>)[fieldKey] = value;
      }
      return acc;
    }, {});

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected");
      return;
    }

    mutation.mutate(updatedFields);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Edit Feature Endpoint</Modal.Title>
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
                  {...register("endpoint", { required: "Endpoint is required" })}
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
                <FormControl.Label>Token Cost</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  {...register("token", {
                    required: "Token cost is required",
                    valueAsNumber: true,
                    min: { value: 0, message: "Token cost must be 0 or greater" },
                  })}
                />
                {errors.token && (
                  <FormControl.Error>{errors.token.message}</FormControl.Error>
                )}
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

export default FeatureEndpointEditModal;

