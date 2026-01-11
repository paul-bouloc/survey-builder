import Image, { ImageProps } from 'next/image'
import * as React from 'react'

import logoBlack from '@/assets/brand/datum-logo-black.svg'
import logoLinedBlack from '@/assets/brand/datum-logo-lined-black.svg'
import logoLinedWhite from '@/assets/brand/datum-logo-lined-white.svg'
import logoWhite from '@/assets/brand/datum-logo-white.svg'

import iconLinedBlack from '@/assets/brand/datum-icon-lined-black.svg'
import iconLinedWhite from '@/assets/brand/datum-icon-lined-white.svg'
import iconDefault from '@/assets/brand/datum-icon.svg'

const datumBrand = {
  base: {
    light: logoBlack,
    dark: logoWhite
  },
  baseIcon: {
    light: iconDefault,
    dark: iconDefault
  },
  lined: {
    light: logoLinedBlack,
    dark: logoLinedWhite
  },
  linedIcon: {
    light: iconLinedBlack,
    dark: iconLinedWhite
  }
} as const

type DatumLogoVariant = keyof typeof datumBrand
type Size = number | string

const DEFAULT_HEIGHT_BY_VARIANT: Record<DatumLogoVariant, number> = {
  base: 32,
  lined: 32,
  baseIcon: 24,
  linedIcon: 24
}

const DEFAULT_RATIO_BY_VARIANT = {
  base: 3.222,
  lined: 3.222,
  baseIcon: 0.866,
  linedIcon: 0.866
} as const

export interface DatumLogoProps extends Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height' | 'fill'
> {
  variant?: DatumLogoVariant

  /**
   * Référence principale: on donne en général la height.
   * Si rien n'est fourni, on prend une valeur par défaut selon la variante.
   */
  size?: Size
  height?: Size

  /**
   * Optionnel: override du ratio si tu veux.
   * Sinon on prend le ratio par défaut de la variante.
   */
  ratio?: number

  alt?: string
  className?: string

  /**
   * className appliquée au wrapper (utile pour margins, display, etc.)
   */
  wrapperClassName?: string
  style?: React.CSSProperties
}

export default function DatumLogo({
  variant = 'base',
  size,
  height,
  ratio,
  alt = 'Datum',
  className,
  wrapperClassName,
  style,
  ...props
}: DatumLogoProps) {
  const { light, dark } = datumBrand[variant]
  const lightSrc = getSvgSrc(light)
  const darkSrc = getSvgSrc(dark)

  const resolvedHeight = height ?? size ?? DEFAULT_HEIGHT_BY_VARIANT[variant]
  const resolvedRatio = ratio ?? DEFAULT_RATIO_BY_VARIANT[variant]

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    height: resolvedHeight,
    aspectRatio: String(resolvedRatio),
    ...style
  }

  const imageClass = `object-contain ${className ?? ''}`

  return (
    <span className={wrapperClassName} style={wrapperStyle}>
      {/* Light */}
      <Image
        {...props}
        src={lightSrc}
        alt={alt}
        fill
        className={`dark:hidden ${imageClass}`}
      />

      {/* Dark */}
      <Image
        {...props}
        src={darkSrc}
        alt={alt}
        fill
        className={`hidden dark:block ${imageClass}`}
      />
    </span>
  )
}

function getSvgSrc(value: string | { src: string }): string {
  return typeof value === 'string' ? value : value.src
}
