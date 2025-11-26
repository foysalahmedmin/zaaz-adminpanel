import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createPlan } from "@/services/plan.service";
import type { TPlan } from "@/types/plan.type";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PlanAddModalProps = {
  default?: Partial<TPlan>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const PlanAddModal: React.FC<PlanAddModalProps> = ({
  isOpen,
  setIsOpen,
  default: plan,
  mutationKey: key = ["plans"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TPlan>>({
    defaultValues: {
      name: plan?.name || "",
      description: plan?.description || "",
      duration: plan?.duration || 1,
      sequence: plan?.sequence || 0,
      is_active: plan?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: createPlan,
    onSuccess: (data) => {
      toast.success(data?.message || "Plan created successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create plan");
    },
  });

  const onSubmit = (data: Partial<TPlan>) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Plan</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Plan name (e.g., Monthly, Yearly)"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FormControl.Error>{errors.name.message}</FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Description</FormControl.Label>
                <FormControl
                  as="textarea"
                  placeholder="Plan description (optional)"
                  className="h-auto min-h-20 resize-none py-2"
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                />
                {errors.description && (
                  <FormControl.Error>
                    {errors.description.message}
                  </FormControl.Error>
                )}
                <FormControl.Helper>
                  Optional description for this plan
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Duration (Days)</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="30"
                  min="1"
                  {...register("duration", {
                    required: "Duration is required",
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
                <FormControl.Helper>
                  Number of days this plan is valid for
                </FormControl.Helper>
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

export default PlanAddModal;
