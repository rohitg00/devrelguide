import React from "react";
import { cn } from "@/lib/utils";

type TypographyProps = {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
  variant?: 
    | "h1" 
    | "h2" 
    | "h3" 
    | "h4" 
    | "p" 
    | "blockquote" 
    | "lead" 
    | "large" 
    | "small" 
    | "muted";
};

const Typography = ({
  as,
  children,
  className,
  variant,
  ...props
}: TypographyProps) => {
  const Component = as || (variant?.match(/^h[1-4]$/) ? variant : "p");

  const variantClassMap = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
    h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    p: "leading-7 [&:not(:first-child)]:mt-6",
    blockquote: "mt-6 border-l-2 pl-6 italic",
    lead: "text-xl text-muted-foreground",
    large: "text-lg font-semibold",
    small: "text-sm font-medium leading-none",
    muted: "text-sm text-muted-foreground",
  };

  const variantClass = variant ? variantClassMap[variant] : "";

  return (
    <Component className={cn(variantClass, className)} {...props}>
      {children}
    </Component>
  );
};

export { Typography }; 