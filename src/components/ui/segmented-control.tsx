import { Tabs as TabsPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Sélecteur compact à deux états ou plus, bâti sur Tabs de Radix.
 * Il n'expose pas de contenu : seul l'état sélectionné est signifiant,
 * ce qui le rend utilisable dans une ligne de menu ou de barre d'outils.
 */
function SegmentedControl({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="segmented-control"
      orientation="horizontal"
      className={cn('inline-flex', className)}
      {...props}
    />
  )
}

function SegmentedControlList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="segmented-control-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-7 w-fit items-center justify-center rounded-md p-[2px]',
        className
      )}
      {...props}
    />
  )
}

function SegmentedControlItem({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="segmented-control-item"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground/60 hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground inline-flex h-full cursor-pointer items-center justify-center rounded-[5px] border border-transparent px-1.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-default disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        'data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground data-active:shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export { SegmentedControl, SegmentedControlItem, SegmentedControlList }
