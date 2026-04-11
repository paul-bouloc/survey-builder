import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export type CharacterCounterProps = {
  currentLength: number
  maxLength: number
  className?: string
}

export function CharacterCounter({
  currentLength,
  maxLength,
  className
}: CharacterCounterProps) {
  const t = useTranslations('common')

  return (
    <p
      data-slot="character-counter"
      className={cn(
        'text-muted-foreground text-left text-sm leading-normal font-normal',
        className
      )}
      aria-live="polite"
    >
      {t('charactersCount', { current: currentLength, max: maxLength })}
    </p>
  )
}
