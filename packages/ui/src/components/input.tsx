import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-(--input-radius) border border-input bg-transparent transition-colors outline-none file:-ms-1.5 file:me-3 file:inline-flex file:items-center file:rounded-sm file:border-0 file:bg-secondary file:px-2.5 file:font-medium file:text-secondary-foreground file:transition-colors hover:file:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/15 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/20 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        sm: "h-8 px-2.5 py-1 text-sm file:h-6 file:text-xs",
        default: "h-9 px-3 py-1.5 text-base file:h-6 file:text-sm md:text-sm",
        lg: "h-10 px-3.5 py-2 text-base file:h-6 file:text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
