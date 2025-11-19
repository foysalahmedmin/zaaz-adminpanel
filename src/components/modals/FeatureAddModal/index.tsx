import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createFeature } from "@/services/feature.service";
import type { TFeature } from "@/types/feature.type";
import type { ErrorResponse } from "@/types/response.type";
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
      description: feature?.description || "",
      path: feature?.path || "",
      prefix: feature?.prefix || "",
      type: feature?.type || "other",
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
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create feature");
      console.error("Create Feature Error:", error);
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

