"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> { }

/**
 * Premium Label Component
 * 
 * - Uppercase tracking for form labels
 * - Subtle color hierarchy
 */
const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-xs font-medium tracking-wider uppercase text-muted-foreground",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label };
