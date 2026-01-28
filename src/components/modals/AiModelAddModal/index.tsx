import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createAiModel } from "@/services/ai-model.service";
import type { TAiModel } from "@/types/ai-model.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type AiModelAddModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  mutationKey?: string[];
};

type TFormInput = Partial<TAiModel>;

const AiModelAddModal: React.FC<AiModelAddModalProps> = ({
  isOpen,
  setIsOpen,
  mutationKey: key = ["ai-models"],
}) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TFormInput>({
    defaultValues: {
      currency: "USD",
      is_active: true,
      is_initial: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: TFormInput) => createAiModel(data),
    onSuccess: (data) => {
      toast.success(data?.message || "AI Model created successfully!");
      queryClient.invalidateQueries({ queryKey: key });
      reset();
      setIsOpen(false);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to create AI Model");
    },
  });

  const onSubmit = (data: TFormInput) => {
    mutation.mutate({
      ...data,
      input_token_price: Number(data.input_token_price),
      output_token_price: Number(data.output_token_price),
    });
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-lg overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Add AI Model</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g. GPT-4"
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
                  placeholder="e.g. gpt-4"
                  {...register("value", {
                    required: "Value is required",
                    pattern: {
                      value: /^[a-z0-9_-]+$/,
                      message:
                        "Value must be lowercase letters, numbers, hyphens or underscores",
                    },
                  })}
                />
                {errors.value && (
                  <FormControl.Error>{errors.value.message}</FormControl.Error>
                )}
                <FormControl.Helper>
                  Unique identifier (lowercase)
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Provider</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g. OpenAI"
                  {...register("provider", {
                    required: "Provider is required",
                  })}
                />
                {errors.provider && (
                  <FormControl.Error>
                    {errors.provider.message}
                  </FormControl.Error>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Input Token Price (USD)</FormControl.Label>
                  <FormControl
                    type="number"
                    step="0.000001"
                    min="0"
                    placeholder="0.00"
                    {...register("input_token_price", {
                      required: "Required",
                      min: { value: 0, message: "Must be non-negative" },
                    })}
                  />
                  {errors.input_token_price && (
                    <FormControl.Error>
                      {errors.input_token_price.message}
                    </FormControl.Error>
                  )}
                </div>
                <div>
                  <FormControl.Label>
                    Output Token Price (USD)
                  </FormControl.Label>
                  <FormControl
                    type="number"
                    step="0.000001"
                    min="0"
                    placeholder="0.00"
                    {...register("output_token_price", {
                      required: "Required",
                      min: { value: 0, message: "Must be non-negative" },
                    })}
                  />
                  {errors.output_token_price && (
                    <FormControl.Error>
                      {errors.output_token_price.message}
                    </FormControl.Error>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    {...register("is_initial")}
                  />
                  <span className="text-sm font-medium">
                    Initial Model (Default)
                  </span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    className="accent-accent size-5"
                    type="checkbox"
                    {...register("is_active")}
                  />
                  <span className="text-sm font-medium">Active</span>
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

export default AiModelAddModal;
