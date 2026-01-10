import {
  getSvgSrc,
  illustrativeIcons,
  type IllustrativeIconName
} from '@/components/icons/illustrative-icons/illustrative-registry'
import { cn } from '@/lib/utils'
import * as React from 'react'

type IllustrativeIconProps = {
  name: IllustrativeIconName

  /**
   * Size in pixels (applied on width/height).
   * Default 100.
   */
  size?: number

  /**
   * Color via Tailwind: use bg-* classes
   * Ex: "bg-foreground", "bg-slate-200", "bg-primary"
   */
  colorClassName?: string

  /**
   * Additional classes (layout, margin, opacity, etc.)
   */
  className?: string

  /**
   * Accessibility
   * - if decorative: aria-hidden=true
   * - otherwise: set a label
   */
  decorative?: boolean
  label?: string
} & Omit<React.ComponentPropsWithoutRef<'span'>, 'color'>

export function IllustrativeIcon({
  name,
  size = 100,
  colorClassName = 'bg-muted-foreground',
  className,
  decorative = true,
  label,
  style,
  ...rest
}: IllustrativeIconProps) {
  const src = getSvgSrc(illustrativeIcons[name])

  const ariaProps = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role: 'img', 'aria-label': label ?? name } as const)

  return (
    <span
      {...rest}
      {...ariaProps}
      className={cn(
        'inline-block shrink-0',
        // color = background because we use mask
        colorClassName,
        className
      )}
      style={{
        width: size,
        height: size,

        // Mask => the SVG cuts the shape, the color comes from the bg-*
        WebkitMaskImage: `url(${src})`,
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        WebkitMaskPosition: 'center',

        maskImage: `url(${src})`,
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
        maskPosition: 'center',

        ...style
      }}
    />
  )
}
