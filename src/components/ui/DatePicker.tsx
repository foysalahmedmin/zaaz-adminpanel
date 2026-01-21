import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import React from "react";
import type { FormControlProps } from "./FormControl";
import { FormControl } from "./FormControl";

/**
 * Custom DatePicker component.
 * - Native calendar icon is moved to the left and hidden (opacity 0) but stays as a hit area.
 * - UI displays a custom icon over that hit area.
 * - Background color follows the default FormControl style.
 */
const DatePicker: React.FC<FormControlProps> = ({
  className,
  type = "date",
  ...props
}) => {
  return (
    <div className="group relative flex w-full items-center">
      {/* Icon layer (Visible but clicks pass through to the indicator underneath) */}
      <div className="pointer-events-none absolute left-0 z-10 flex h-full w-10 items-center justify-center">
        <Calendar className="text-muted-foreground group-focus-within:text-accent size-4 transition-colors" />
      </div>

      <FormControl
        type={type}
        className={cn(
          "h-9 appearance-none pr-3 pl-10",
          // Move the native indicator to the left, make it 100% height of the left section, and hide it
          "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:z-20 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
          className,
        )}
        {...props}
      />
    </div>
  );
};

export { DatePicker };
