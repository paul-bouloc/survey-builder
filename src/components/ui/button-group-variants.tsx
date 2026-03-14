import { cva } from 'class-variance-authority'

export const buttonGroupVariants = cva(
  "has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>button:last-of-type]:rounded-r-lg! [&>button:not(:last-of-type)]:rounded-r-none [&>button:not(:first-of-type)]:rounded-l-none [&>button:not(:first-of-type)]:border-l-0',
        vertical:
          '[&>button:last-of-type]:rounded-b-lg! flex-col [&>button:not(:last-of-type)]:rounded-b-none [&>button:not(:first-of-type)]:rounded-t-none [&>button:not(:first-of-type)]:border-t-0'
      }
    },
    defaultVariants: {
      orientation: 'horizontal'
    }
  }
)
