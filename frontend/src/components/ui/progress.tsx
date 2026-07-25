import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/utils/cn'

interface ProgressProps {
  value?: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ value = 0, className, indicatorClassName }: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-border/50', className)}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'h-full w-full flex-1 rounded-full bg-primary transition-transform duration-500 ease-out',
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}
