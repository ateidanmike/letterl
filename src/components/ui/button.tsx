import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-bold transition-[transform,box-shadow,background-color] duration-100 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-2 border-[var(--nb-ink)] shadow-[3px_3px_0_0_var(--nb-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--nb-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-[var(--nb-ink)] shadow-[3px_3px_0_0_var(--nb-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--nb-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        outline:
          "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-2 border-[var(--nb-ink)] shadow-[3px_3px_0_0_var(--nb-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--nb-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-[var(--nb-ink)] shadow-[3px_3px_0_0_var(--nb-ink)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_var(--nb-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        ghost:
          "border-2 border-transparent hover:border-[var(--nb-ink)] hover:bg-accent hover:text-accent-foreground",
        link: "underline decoration-2 underline-offset-4 hover:decoration-[var(--nb-pink)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
