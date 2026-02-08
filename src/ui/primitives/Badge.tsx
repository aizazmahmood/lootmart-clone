import * as React from "react";
import { cn } from "@/src/ui/primitives/utils";

type BadgeVariant = "available" | "unavailable" | "neutral";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  available: "bg-[#e9f6ec] text-[#1c7f3c]",
  unavailable: "bg-[#eceff3] text-[#7b8694]",
  neutral: "bg-[#fef3d2] text-[#a2771d]",
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
