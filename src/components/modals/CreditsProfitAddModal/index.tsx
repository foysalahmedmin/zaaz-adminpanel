import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createCreditsProfit } from "@/services/credits-profit.service";
import type { TCreditsProfit } from "@/types/credits-profit.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type CreditsProfitAddModalProps = {
  default?: Partial<TCreditsProfit>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

const CreditsProfitAddModal: React.FC<CreditsProfitAddModalProps> = ({
  isOpen,
  setIsOpen,
  default: profit,
  mutationKey: key = ["credits-profits"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<TCreditsProfit>>({
    defaultValues: {
      name: profit?.name || "",
      percentage: profit?.percentage || 0,
      is_active: profit?.is_active ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: createCreditsProfit,
    onSuccess: (data) => {
      toast.success(data?.message || "Credits Profit created successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to create credits profit",
      );
    },
  });

  const onSubmit = (data: Partial<TCreditsProfit>) => {
    mutation.mutate({
      ...data,
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Add Credits Profit</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Profit name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FormControl.Error>{errors.name.message}</FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Percentage</FormControl.Label>
                <FormControl
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register("percentage", {
                    required: "Percentage is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Percentage must be 0 or greater",
                    },
                    max: {
                      value: 100,
                      message: "Percentage must be 100 or less",
                    },
                  })}
                />
                {errors.percentage && (
                  <FormControl.Error>
                    {errors.percentage.message}
                  </FormControl.Error>
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
                Create
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default CreditsProfitAddModal;
