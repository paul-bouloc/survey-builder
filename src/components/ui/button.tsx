import { type VariantProps } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { buttonVariants } from '@/components/ui/button-variants'
import { cn } from '@/lib/utils'

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  const isDisabled = disabled || isLoading

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  // Exclude props that conflict with Framer Motion
  const {
    onDrag,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props

  const contentRef = React.useRef<HTMLSpanElement>(null)
  const measureRef = React.useRef<HTMLSpanElement>(null)
  const [width, setWidth] = React.useState<number | undefined>(undefined)

  React.useLayoutEffect(() => {
    if (measureRef.current) {
      const newWidth = measureRef.current.offsetWidth
      setWidth(newWidth)
    }
  }, [children, isLoading])

  return (
    <>
      {/* Invisible element to measure content width */}
      <span
        ref={measureRef}
        className={cn(
          buttonVariants({ variant, size }),
          'invisible absolute pointer-events-none whitespace-nowrap'
        )}
        aria-hidden="true"
      >
        <span className="inline-flex items-center justify-center gap-1.5">
          {children}
          {isLoading && <Loader2 className="size-4" />}
        </span>
      </span>
      <motion.button
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          buttonVariants({ variant, size, className }),
          'overflow-hidden'
        )}
        disabled={isDisabled}
        animate={width !== undefined ? { width } : {}}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        {...(buttonProps as Omit<
          React.ComponentProps<'button'>,
          | 'onDrag'
          | 'onDragStart'
          | 'onDragEnd'
          | 'onDragEnter'
          | 'onDragExit'
          | 'onDragLeave'
          | 'onDragOver'
          | 'onAnimationStart'
          | 'onAnimationEnd'
        >)}
      >
        <span
          ref={contentRef}
          className="inline-flex items-center justify-center gap-1.5"
        >
        <AnimatePresence mode="wait">
          <motion.span
            key={String(children)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="inline-block"
          >
            {children}
          </motion.span>
        </AnimatePresence>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: 'auto' }}
              exit={{ opacity: 0, scale: 0.8, width: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <Loader2 className="size-4 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
    </>
  )
}

export { Button }
