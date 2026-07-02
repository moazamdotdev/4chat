"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-lg bg-foreground text-[13px] font-bold leading-none text-background font-display",
        className
      )}
    >
      4
    </div>
  )
}
