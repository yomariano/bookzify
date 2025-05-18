import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Simple skeleton loader component for UI loading states
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(clsx("animate-pulse rounded-md bg-muted", className))}
      {...props}
    />
  )
} 