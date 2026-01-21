import useIsDark from "@/hooks/ui/useIsDark";
import { cn } from "@/lib/utils";
import { uploadFiles } from "@/services/storage.service";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import React from "react";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

type BlockNoteEditorProps = {
  value?: string; // HTML string
  onChange?: (html: string) => void;
  className?: string;
  editable?: boolean;
};

const BlockNoteEditorComponent: React.FC<BlockNoteEditorProps> = ({
  value = "",
  onChange,
  className,
  editable = true,
}) => {
  const isDark = useIsDark();
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
    uploadFile: async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadFiles(formData);
        
        if (response.success && response.data && response.data.length > 0) {
          return response.data[0].url || "";
        }
        return "";
      } catch (error) {
        console.error("File upload failed:", error);
        return "";
      }
    },
    domAttributes: {
      editor: {
        style: "min-height: 350px; padding-top: 1rem; padding-bottom: 1rem;",
      },
    },
  });

  const [initialized, setInitialized] = React.useState(false);
  const isUpdatingFromProps = React.useRef(false);

  // Set editable state
  React.useEffect(() => {
    if (editor) {
      editor.isEditable = editable;
    }
  }, [editor, editable]);

  // Initialize editor with HTML content
  React.useEffect(() => {
    if (editor && !initialized) {
      const loadContent = async () => {
        if (value) {
          try {
            const blocks = await editor.tryParseHTMLToBlocks(value);
            editor.replaceBlocks(editor.document, blocks);
          } catch {
            // Error parsing HTML - will be handled silently
          }
        }
        setInitialized(true);
      };
      loadContent();
    }
  }, [value, editor, initialized]);

  const handleChange = React.useCallback(async () => {
    if (onChange && editor && initialized && !isUpdatingFromProps.current) {
      try {
        const html = await editor.blocksToHTMLLossy(editor.document);
        onChange(html);
      } catch {
        // Error converting to HTML - will be handled silently
      }
    }
  }, [onChange, editor, initialized]);

  // Update editor when value changes externally (for form reset, etc.)
  React.useEffect(() => {
    if (editor && initialized && value !== undefined) {
      const updateContent = async () => {
        try {
          const currentHtml = await editor.blocksToHTMLLossy(editor.document);
          if (currentHtml !== value) {
            isUpdatingFromProps.current = true;
            const blocks = await editor.tryParseHTMLToBlocks(value || "");
            editor.replaceBlocks(editor.document, blocks);
            // Reset flag after a short delay to allow onChange to process
            setTimeout(() => {
              isUpdatingFromProps.current = false;
            }, 100);
          }
        } catch {
          // Error updating content - will be handled silently
          isUpdatingFromProps.current = false;
        }
      };
      updateContent();
    }
  }, [value, editor, initialized]);

  if (!initialized) {
    return (
      <div
        className={cn(
          "border-input bg-card flex min-h-[200px] items-center justify-center rounded-md border",
          className,
        )}
      >
        <div className="text-muted-foreground text-sm">Loading editor...</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-input bg-card rounded-md border",
        "[&_.bn-container]:min-h-[200px] [&_.bn-container]:p-4",
        "[&_.bn-editor]:outline-none",
        "[&_.bn-inline-content]:text-foreground",
        className,
      )}
    >
      <BlockNoteView
        editor={editor}
        onChange={handleChange}
        theme={isDark ? "dark" : "light"}
      />
    </div>
  );
};

export default BlockNoteEditorComponent;
