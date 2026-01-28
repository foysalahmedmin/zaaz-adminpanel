import BlockNoteEditor from "@/components/ui/BlockNoteEditor";
import { Button } from "@/components/ui/Button";
import { FormControl } from "@/components/ui/FormControl";
import { Modal } from "@/components/ui/Modal";
import { updateFeaturePopup } from "@/services/feature-popup.service";
import { fetchFeatures } from "@/services/feature.service";
import type {
  TFeaturePopup,
  TFeaturePopupAction,
} from "@/types/feature-popup.type";
import type { TErrorResponse } from "@/types/response.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader2, Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type FeaturePopupEditModalProps = {
  default: TFeaturePopup;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  className?: string;
  mutationKey?: string[];
};

// Actions Input Component (same as AddModal)
type ActionsInputProps = {
  value?: TFeaturePopupAction[];
  onChange: (value: TFeaturePopupAction[]) => void;
};

const ActionsInput: React.FC<ActionsInputProps> = ({
  value = [],
  onChange,
}) => {
  const [newAction, setNewAction] = useState<Partial<TFeaturePopupAction>>({
    name: "",
    path: "",
    type: "link",
    variant: "default",
    size: "default",
    position: "content",
  });

  const handleAddAction = () => {
    if (!newAction.name?.trim()) {
      toast.error("Action name is required");
      return;
    }
    onChange([
      ...value,
      {
        name: newAction.name.trim(),
        path: newAction.path?.trim() || undefined,
        type: newAction.type || "link",
        variant: newAction.variant || "default",
        size: newAction.size || "default",
        position: newAction.position || "content",
      },
    ]);
    setNewAction({
      name: "",
      path: "",
      type: "link",
      variant: "default",
      size: "default",
      position: "content",
    });
  };

  const handleRemoveAction = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (
    index: number,
    field: keyof TFeaturePopupAction,
    fieldValue: string,
  ) => {
    const updated = [...value];
    updated[index] = {
      ...updated[index],
      [field]: fieldValue,
    };
    onChange(updated);
  };

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="border-input bg-card space-y-2 rounded-md border p-3">
        {value.map((action, index) => (
          <div
            key={index}
            className="bg-muted/50 flex flex-col gap-2 rounded p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">Action {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAction(index)}
                className="text-destructive hover:text-destructive h-6 w-6 p-0"
              >
                <X className="size-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <FormControl.Label className="text-xs">Name</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Action name"
                  value={action.name}
                  onChange={(e) =>
                    handleUpdateAction(index, "name", e.target.value)
                  }
                  className="text-sm"
                />
              </div>
              <div>
                <FormControl.Label className="text-xs">Type</FormControl.Label>
                <FormControl
                  as="select"
                  value={action.type}
                  onChange={(e) =>
                    handleUpdateAction(index, "type", e.target.value)
                  }
                  className="text-sm"
                >
                  <option value="link">Link</option>
                  <option value="other">Other</option>
                </FormControl>
              </div>
            </div>
            {action.type === "link" && (
              <div>
                <FormControl.Label className="text-xs">
                  Path (Optional)
                </FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="/path or https://url"
                  value={action.path || ""}
                  onChange={(e) =>
                    handleUpdateAction(index, "path", e.target.value)
                  }
                  className="text-sm"
                />
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <FormControl.Label className="text-xs">
                  Variant
                </FormControl.Label>
                <FormControl
                  as="select"
                  value={action.variant || "default"}
                  onChange={(e) =>
                    handleUpdateAction(index, "variant", e.target.value)
                  }
                  className="text-sm"
                >
                  <option value="default">Default</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                  <option value="destructive">Destructive</option>
                  <option value="link">Link</option>
                </FormControl>
              </div>
              <div>
                <FormControl.Label className="text-xs">Size</FormControl.Label>
                <FormControl
                  as="select"
                  value={action.size || "default"}
                  onChange={(e) =>
                    handleUpdateAction(index, "size", e.target.value)
                  }
                  className="text-sm"
                >
                  <option value="full">Full</option>
                  <option value="default">Default</option>
                  <option value="sm">Small</option>
                  <option value="lg">Large</option>
                  <option value="icon">Icon</option>
                  <option value="icon-sm">Icon Small</option>
                  <option value="icon-lg">Icon Large</option>
                </FormControl>
              </div>
              <div>
                <FormControl.Label className="text-xs">
                  Position
                </FormControl.Label>
                <FormControl
                  as="select"
                  value={action.position || "content"}
                  onChange={(e) =>
                    handleUpdateAction(index, "position", e.target.value)
                  }
                  className="text-sm"
                >
                  <option value="header">Header</option>
                  <option value="content">Content</option>
                  <option value="footer">Footer</option>
                </FormControl>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <FormControl.Label className="text-xs">
              New Action Name
            </FormControl.Label>
            <FormControl
              type="text"
              placeholder="Action name"
              value={newAction.name || ""}
              onChange={(e) =>
                setNewAction({ ...newAction, name: e.target.value })
              }
              className="text-sm"
            />
          </div>
          <div>
            <FormControl.Label className="text-xs">Type</FormControl.Label>
            <FormControl
              as="select"
              value={newAction.type || "link"}
              onChange={(e) =>
                setNewAction({
                  ...newAction,
                  type: e.target.value as "link" | "other",
                })
              }
              className="text-sm"
            >
              <option value="link">Link</option>
              <option value="other">Other</option>
            </FormControl>
          </div>
        </div>
        {newAction.type === "link" && (
          <div>
            <FormControl.Label className="text-xs">
              Path (Optional)
            </FormControl.Label>
            <FormControl
              type="text"
              placeholder="/path or https://url"
              value={newAction.path || ""}
              onChange={(e) =>
                setNewAction({ ...newAction, path: e.target.value })
              }
              className="text-sm"
            />
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <FormControl.Label className="text-xs">Variant</FormControl.Label>
            <FormControl
              as="select"
              value={newAction.variant || "default"}
              onChange={(e) =>
                setNewAction({ ...newAction, variant: e.target.value as any })
              }
              className="text-sm"
            >
              <option value="default">Default</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="destructive">Destructive</option>
              <option value="link">Link</option>
            </FormControl>
          </div>
          <div>
            <FormControl.Label className="text-xs">Size</FormControl.Label>
            <FormControl
              as="select"
              value={newAction.size || "default"}
              onChange={(e) =>
                setNewAction({ ...newAction, size: e.target.value as any })
              }
              className="text-sm"
            >
              <option value="full">Full</option>
              <option value="default">Default</option>
              <option value="sm">Small</option>
              <option value="lg">Large</option>
              <option value="icon">Icon</option>
              <option value="icon-sm">Icon Small</option>
              <option value="icon-lg">Icon Large</option>
            </FormControl>
          </div>
          <div>
            <FormControl.Label className="text-xs">Position</FormControl.Label>
            <FormControl
              as="select"
              value={newAction.position || "content"}
              onChange={(e) =>
                setNewAction({ ...newAction, position: e.target.value as any })
              }
              className="text-sm"
            >
              <option value="header">Header</option>
              <option value="content">Content</option>
              <option value="footer">Footer</option>
            </FormControl>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddAction}
          disabled={!newAction.name?.trim()}
          className="w-full"
        >
          <Plus className="size-4" /> Add Action
        </Button>
      </div>
    </div>
  );
};

const FeaturePopupEditModal: React.FC<FeaturePopupEditModalProps> = ({
  isOpen,
  setIsOpen,
  default: popup,
  mutationKey: key = ["feature-popups"],
}) => {
  const queryClient = useQueryClient();

  const { data: featuresData } = useQuery({
    queryKey: ["features"],
    queryFn: () => fetchFeatures({ sort: "name", is_active: true }),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    popup.image || null,
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(
    popup.video || null,
  );
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<Partial<TFeaturePopup> & { image?: File; video?: File }>({
    defaultValues: {
      feature: popup?.feature
        ? typeof popup.feature === "string"
          ? popup.feature
          : popup.feature._id
        : "",
      name: popup?.name || "",
      value: popup?.value || "",
      description: popup?.description || "",
      content: popup?.content || "",
      actions: popup?.actions || [],
      category: popup?.category || "single-time",
      priority: popup?.priority ?? 0,
      size: popup?.size || "md",
      delay: popup?.delay ?? 0,
      duration: popup?.duration ?? 0,
      is_active: popup?.is_active ?? true,
    },
  });

  useEffect(() => {
    reset({
      feature: popup?.feature
        ? typeof popup.feature === "string"
          ? popup.feature
          : popup.feature._id
        : "",
      name: popup?.name || "",
      value: popup?.value || "",
      description: popup?.description || "",
      content: popup?.content || "",
      actions: popup?.actions || [],
      category: popup?.category || "single-time",
      priority: popup?.priority ?? 0,
      size: popup?.size || "md",
      delay: popup?.delay ?? 0,
      duration: popup?.duration ?? 0,
      is_active: popup?.is_active ?? true,
    });
    setImagePreview(popup.image || null);
    setVideoPreview(popup.video || null);
    setImageFile(null);
    setVideoFile(null);
    if (popup.video) {
      setMediaType("video");
    } else {
      setMediaType("image");
    }
  }, [popup, reset]);

  const mutation = useMutation({
    mutationFn: (
      data: Partial<TFeaturePopup> & { image?: File; video?: File },
    ) => {
      if (!popup._id) {
        throw new Error("Feature Popup ID is missing");
      }
      return updateFeaturePopup(popup._id, data);
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Feature popup updated successfully!");
      queryClient.invalidateQueries({ queryKey: key || [] });
      setIsOpen(false);
    },
    onError: (error: AxiosError<TErrorResponse>) => {
      toast.error(
        error.response?.data?.message || "Failed to update feature popup",
      );
    },
  });

  const onSubmit = (
    data: Partial<TFeaturePopup> & { image?: File; video?: File },
  ) => {
    const { image: _image, video: _video, ...restData } = data;

    let imagePayload: File | null | undefined;
    let videoPayload: File | null | undefined;

    // Determine Image Payload
    if (mediaType === "video") {
      // If switched to Video, strictly remove Image
      imagePayload = null;
    } else {
      // Image Mode
      if (imageFile) {
        imagePayload = imageFile; // New file to upload
      } else if (imagePreview) {
        imagePayload = undefined; // Keep existing image
      } else {
        imagePayload = null; // No file, no preview -> Remove existing image
      }
    }

    // Determine Video Payload
    if (mediaType === "image") {
      // If switched to Image, strictly remove Video
      videoPayload = null;
    } else {
      // Video Mode
      if (videoFile) {
        videoPayload = videoFile; // New file to upload
      } else if (videoPreview) {
        videoPayload = undefined; // Keep existing video
      } else {
        videoPayload = null; // No file, no preview -> Remove existing video
      }
    }

    mutation.mutate({
      ...restData,
      image: imagePayload,
      video: videoPayload,
    } as Partial<TFeaturePopup> & { image?: File | null; video?: File | null });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (popup.image) {
      // Mark old image for deletion
      setValue("image", undefined);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    if (popup.video) {
      // Mark old video for deletion
      setValue("video", undefined);
    }
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Modal.Backdrop>
        <Modal.Content className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <Modal.Header>
            <Modal.Title>Edit Feature Popup</Modal.Title>
            <Modal.Close />
          </Modal.Header>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Modal.Body className="grid gap-4">
              <div>
                <FormControl.Label>Feature *</FormControl.Label>
                <FormControl
                  as="select"
                  {...register("feature", { required: "Feature is required" })}
                >
                  <option value="">Select a feature</option>
                  {featuresData?.data?.map((feature) => (
                    <option key={feature._id} value={feature._id}>
                      {feature.name}
                    </option>
                  ))}
                </FormControl>
                {errors.feature && (
                  <FormControl.Error>
                    {errors.feature.message}
                  </FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Name *</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="Popup name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FormControl.Error>{errors.name.message}</FormControl.Error>
                )}
              </div>

              <div>
                <FormControl.Label>Value *</FormControl.Label>
                <FormControl
                  type="text"
                  placeholder="popup-value"
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
                  })}
                />
                {errors.value && (
                  <FormControl.Error>{errors.value.message}</FormControl.Error>
                )}
                <FormControl.Helper>
                  Unique identifier (lowercase, alphanumeric with
                  hyphens/underscores).
                </FormControl.Helper>
              </div>

              <div>
                <FormControl.Label>Description (Optional)</FormControl.Label>
                <FormControl
                  as="textarea"
                  className="h-auto min-h-20 py-2"
                  placeholder="Popup description"
                  {...register("description")}
                />
              </div>

              <div>
                <FormControl.Label>Media Type</FormControl.Label>
                <div className="flex items-center gap-4 py-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="mediaType"
                      value="image"
                      checked={mediaType === "image"}
                      onChange={() => {
                        setMediaType("image");
                        handleRemoveVideo();
                      }}
                      className="accent-primary"
                    />
                    Image
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="mediaType"
                      value="video"
                      checked={mediaType === "video"}
                      onChange={() => {
                        setMediaType("video");
                        handleRemoveImage();
                      }}
                      className="accent-primary"
                    />
                    Video
                  </label>
                </div>
              </div>

              {mediaType === "image" && (
                <div>
                  <FormControl.Label>Image (Optional)</FormControl.Label>
                  {imagePreview && (
                    <div className="mb-2 flex items-center gap-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-40 rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveImage}
                        className="text-destructive"
                      >
                        <X className="size-4" /> Remove
                      </Button>
                    </div>
                  )}
                  <FormControl
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                  />
                  <FormControl.Helper>
                    Max size: 5MB. Allowed types: JPEG, PNG, WebP, GIF
                  </FormControl.Helper>
                </div>
              )}

              {mediaType === "video" && (
                <div>
                  <FormControl.Label>Video (Optional)</FormControl.Label>
                  {videoPreview && (
                    <div className="mb-2 flex items-center gap-2">
                      <video
                        src={videoPreview}
                        controls
                        className="max-h-40 rounded-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveVideo}
                        className="text-destructive"
                      >
                        <X className="size-4" /> Remove
                      </Button>
                    </div>
                  )}
                  <FormControl
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={handleVideoChange}
                  />
                  <FormControl.Helper>
                    Max size: 50MB. Allowed types: MP4, WebM, OGG
                  </FormControl.Helper>
                </div>
              )}

              <div>
                <FormControl.Label>Content (Optional)</FormControl.Label>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <BlockNoteEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <FormControl.Label>Actions (Optional)</FormControl.Label>
                <FormControl.Helper>
                  Add action buttons that will appear in the popup modal.
                </FormControl.Helper>
                <Controller
                  name="actions"
                  control={control}
                  render={({ field }) => (
                    <ActionsInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div>
                <FormControl.Label>Category</FormControl.Label>
                <FormControl as="select" {...register("category")}>
                  <option value="single-time">
                    Single-Time (Show once per session)
                  </option>
                  <option value="multi-time">
                    Multi-Time (Can show multiple times)
                  </option>
                </FormControl>
                <FormControl.Helper>
                  Single-time popups show only once per user session. Multi-time
                  popups can be shown multiple times.
                </FormControl.Helper>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Priority</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0"
                    {...register("priority", {
                      valueAsNumber: true,
                    })}
                  />
                  <FormControl.Helper>
                    Higher priority popups are shown first. Default: 0
                  </FormControl.Helper>
                </div>
                <div>
                  <FormControl.Label>Modal Size</FormControl.Label>
                  <FormControl as="select" {...register("size")}>
                    <option value="sm">Small</option>
                    <option value="md">Medium (Default)</option>
                    <option value="lg">Large</option>
                    <option value="xl">Extra Large</option>
                    <option value="full">Full Screen</option>
                  </FormControl>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormControl.Label>Delay (seconds)</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0"
                    min="0"
                    {...register("delay", {
                      valueAsNumber: true,
                    })}
                  />
                  <FormControl.Helper>
                    Delay before showing popup. 0 = show immediately
                  </FormControl.Helper>
                </div>
                <div>
                  <FormControl.Label>Duration (seconds)</FormControl.Label>
                  <FormControl
                    type="number"
                    placeholder="0"
                    min="0"
                    {...register("duration", {
                      valueAsNumber: true,
                    })}
                  />
                  <FormControl.Helper>
                    Auto-close after duration. 0 = manual close only
                  </FormControl.Helper>
                </div>
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

export default FeaturePopupEditModal;
