import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button-variants'

interface TooltipLinkButtonProps extends VariantProps<typeof buttonVariants> {
  href: string
  tooltip: string
  children: React.ReactNode
  className?: string
}

export function TooltipLinkButton({
  href,
  tooltip,
  children,
  variant = 'outline',
  size = 'icon-sm',
  className
}: TooltipLinkButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>
          <Button variant={variant} size={size} className={className}>
            {children}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
