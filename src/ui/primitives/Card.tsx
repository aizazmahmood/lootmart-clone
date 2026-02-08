import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/src/ui/primitives/utils";

type CardVariant = "default" | "soft";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  asChild?: boolean;
};

const variantClasses: Record<CardVariant, string> = {
  default: "bg-white",
  soft: "bg-[#fbf8f3]",
};

export function Card({
  variant = "default",
  asChild,
  className,
  ...props
}: CardProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "rounded-3xl border border-[#efe6da] shadow-[0_12px_30px_rgba(17,24,39,0.08)]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
