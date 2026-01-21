import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { createPlagiarismDocument } from "@/services/plagiarism.service";
import type { ErrorResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { FileUp, Trash2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type PlagiarismAddModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

interface TPlagiarismFormInput {
  type?: string;
  is_multiple: boolean;
}

const PlagiarismAddModal: React.FC<PlagiarismAddModalProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<TPlagiarismFormInput>({
      defaultValues: {
        is_multiple: false,
      },
    });

  const isMultiple = watch("is_multiple");

  const mutation = useMutation({
    mutationFn: (payload: FormData) => createPlagiarismDocument(payload),
    onSuccess: () => {
      toast.success("Document(s) ingested successfully!");
      queryClient.invalidateQueries({ queryKey: ["plagiarism-documents"] });
      onClose();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.response?.data?.message || "Failed to ingest document");
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    // Filter for PDF and DOC files
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx"),
    );

    if (validFiles.length !== files.length) {
      toast.warning("Only PDF and DOC/DOCX files are allowed");
    }

    if (isMultiple) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    } else {
      setSelectedFiles(validFiles.slice(0, 1));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const onClose = () => {
    setIsOpen(false);
    reset();
    setSelectedFiles([]);
  };

  const onSubmit = (data: TPlagiarismFormInput) => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    if (data.type) formData.append("type", data.type);
    formData.append("is_multiple", String(data.is_multiple));

    mutation.mutate(formData);
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-w-xl">
          <Modal.Header>
            <Modal.Title>Ingest Plagiarism Document</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Type (Optional)</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="e.g., academic, blog, legal"
                  {...register("type")}
                />
              </div>

              <div>
                <FormControl.Label>
                  Documents (PDF, DOC, DOCX)
                </FormControl.Label>
                <div
                  onClick={handleBoxClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="bg-primary/10 text-primary rounded-full p-3">
                    <FileUp className="size-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      Drag & drop files here or click to browse
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      PDF, DOC, DOCX up to 10MB each
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple={isMultiple}
                    accept=".pdf,.doc,.docx"
                    onChange={onFileChange}
                  />
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="bg-muted/50 flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="truncate font-medium">
                            {file.name}
                          </span>
                          <span className="text-muted-foreground shrink-0 text-xs">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          shape="icon"
                          onClick={() => removeFile(index)}
                          className="shrink-0 text-red-500 hover:bg-red-500/10 hover:text-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="is_multiple"
                  checked={isMultiple}
                  onChange={(e) => {
                    setValue("is_multiple", e.target.checked);
                    if (!e.target.checked && selectedFiles.length > 1) {
                      setSelectedFiles(selectedFiles.slice(0, 1));
                    }
                  }}
                />
                <FormControl.Label
                  htmlFor="is_multiple"
                  className="mb-0 cursor-pointer"
                >
                  Allow multiple files
                </FormControl.Label>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={mutation.isPending}>
                Ingest Document
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Content>
      </Modal.Backdrop>
    </Modal>
  );
};

export default PlagiarismAddModal;
