import { useLayoutEffect, useRef } from 'react'

/**
 * Auto-resizes a textarea to fit its content.
 * Uses useLayoutEffect to apply DOM mutations before paint and avoid flicker.
 */
export function useAutoResize(value: string, minHeightPx: number) {
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(minHeightPx, el.scrollHeight)}px`
  }, [value, minHeightPx])

  return ref
}
