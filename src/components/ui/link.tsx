import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import * as React from "react";

const linkVariants = cva(
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  asChild?: boolean;
  shine?: boolean;
  href: string;
}

const getShineClasses = (variant: LinkProps["variant"] = "default") => {
  const baseClasses =
    "hidden group-hover:block absolute w-[100px] h-full bg-gradient-to-r from-transparent to-transparent top-0 left-[-100px] opacity-60 animate-shine";

  const shineColors = {
    default: "via-primary-foreground/80",
    destructive: "via-destructive-foreground/80",
    outline: "via-accent-foreground/80",
    secondary: "via-secondary-foreground/80",
    ghost: "via-accent-foreground/80",
    link: "via-primary/80",
  };

  return `${baseClasses} ${shineColors[variant ?? "default"]}`;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { className, variant, size, asChild = false, shine, href, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : NextLink;

    return (
      <Comp
        className={cn(linkVariants({ variant, size, className }))}
        ref={ref}
        href={href}
        {...props}
      >
        {props.children}
        {shine && <span className={getShineClasses(variant)}></span>}
      </Comp>
    );
  }
);

Link.displayName = "Link";

export { Link, linkVariants };
