import * as React from "react";
import { cn } from "@/src/ui/primitives/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-[#e6dccf] bg-[#fbf8f3] px-4 text-sm text-[#1f2a44] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
