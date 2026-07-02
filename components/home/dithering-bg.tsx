"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Dithering } from "@paper-design/shaders-react"

interface DitheringBackgroundProps {
  className?: string
}

export function DitheringBackground({ className }: DitheringBackgroundProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])

  const isDark = mounted ? resolvedTheme !== "light" : false

  return (
    <div className={className} aria-hidden>
      <Dithering
        colorBack={isDark ? "#1a1a1a" : "#e8e0d0"}
        colorFront={isDark ? "#c8b890" : "#3a3020"}
        shape="warp"
        type="4x4"
        size={2.5}
        speed={0.3}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  )
}
