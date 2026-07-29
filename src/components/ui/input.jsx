import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, label, error, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <label className="block space-y-2 text-sm font-medium text-muted-foreground">
      {label && <span>{label}</span>}
      <input
        id={inputId}
        type={type}
        aria-invalid={Boolean(error)}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 file:mr-3 file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-sm file:font-medium file:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-indigo-900/40",
          error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <span className="block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
});
Input.displayName = "Input";

export { Input };
