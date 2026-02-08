import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/src/ui/primitives/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#f4c44f] text-[#1b2a3b] shadow-sm hover:bg-[#f0b93c] focus-visible:ring-[#1b2a3b]",
  secondary:
    "border border-[#e6dccf] bg-white text-[#1f2a44] shadow-sm hover:bg-[#f7f1e7]",
  ghost: "text-[#1f2a44] hover:bg-[#f7f1e7]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", asChild, className, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4c44f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
