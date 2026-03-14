import {
  selectSurveyMeta,
  updateSurveyMeta
} from '@/features/surveys/editor/state'
import { useAutoResize } from '@/hooks/use-auto-resize'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useCallback, type ChangeEvent } from 'react'

const invisibleInputClass =
  'w-full min-w-0 border-0 bg-transparent p-0 shadow-none outline-none focus:ring-0 focus-visible:ring-0 resize-none overflow-hidden placeholder:text-muted-foreground placeholder:opacity-50 transition-colors rounded'

const fieldWrapperClass =
  'dark:hover:bg-muted/50 dark:ring-muted/50 rounded ring-0 ring-neutral-200/50 transition-all hover:bg-neutral-200/50 hover:ring-6'

interface SurveyEditorMetaBlockProps {
  className?: string
}

export function SurveyEditorMetaBlock({
  className
}: SurveyEditorMetaBlockProps) {
  const meta = useAppSelector(selectSurveyMeta)
  const dispatch = useAppDispatch()
  const tEdit = useTranslations('surveys.edit')
  const tForm = useTranslations('form')

  const handleMetaChange = useCallback(
    (field: 'title' | 'subtitle' | 'description') => (value: string) =>
      dispatch(updateSurveyMeta({ [field]: value })),
    [dispatch]
  )

  if (!meta) return null

  const isTitleEmpty = meta.title.trim() === ''

  return (
    <div
      className={cn('flex flex-col gap-1 py-4', className)}
      data-block="survey-meta"
    >
      {/* Title — highlighted in red when empty */}
      <div
        className={cn(
          'rounded transition-all',
          isTitleEmpty
            ? 'bg-destructive/10 ring-destructive/10 hover:bg-destructive/10 hover:ring-destructive/10 mb-5 ring-6'
            : fieldWrapperClass
        )}
      >
        <InvisibleTextField
          value={meta.title}
          placeholder={tEdit('meta.noTitle')}
          aria-label={tForm('inputs.title.label')}
          minHeightPx={32}
          spellCheck={false}
          onChange={handleMetaChange('title')}
          className="text-2xl font-semibold"
        />

        <AnimatePresence initial={false}>
          {isTitleEmpty && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="text-destructive mt-1 text-sm"
                role="alert"
                aria-live="polite"
              >
                {tEdit('meta.titleRequired')}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtitle */}
      <div className={cn(fieldWrapperClass, 'pt-1')}>
        <InvisibleTextField
          value={meta.subtitle}
          placeholder={tEdit('meta.noSubtitle')}
          aria-label={tForm('inputs.subtitle.label')}
          minHeightPx={24}
          spellCheck={false}
          onChange={handleMetaChange('subtitle')}
          className="text-muted-foreground text-base font-medium"
        />
      </div>

      {/* Description */}
      <div className={cn(fieldWrapperClass, 'pt-1')}>
        <InvisibleTextField
          value={meta.description}
          placeholder={tEdit('meta.noDescription')}
          aria-label={tForm('inputs.description.label')}
          minHeightPx={40}
          spellCheck={false}
          onChange={handleMetaChange('description')}
          className="text-muted-foreground text-sm leading-relaxed font-normal"
        />
      </div>
    </div>
  )
}

// ─── Components ───────────────────────────────────────────────────────────────

interface InvisibleTextFieldProps {
  value: string
  placeholder: string
  'aria-label': string
  className?: string
  minHeightPx?: number
  spellCheck?: boolean
  onChange: (value: string) => void
}

function InvisibleTextField({
  value,
  placeholder,
  'aria-label': ariaLabel,
  className,
  minHeightPx = 24,
  spellCheck = true,
  onChange
}: InvisibleTextFieldProps) {
  const ref = useAutoResize(value, minHeightPx)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    [onChange]
  )

  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      rows={1}
      spellCheck={spellCheck}
      style={{ height: minHeightPx }}
      className={cn(invisibleInputClass, className)}
      onChange={handleChange}
    />
  )
}
