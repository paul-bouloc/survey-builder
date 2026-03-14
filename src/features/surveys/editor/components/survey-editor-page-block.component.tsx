import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { setSelection, updatePage } from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { useAppDispatch } from '@/store/hooks'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, type ChangeEvent } from 'react'

const pageTitleInputClass =
  'min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-muted-foreground placeholder:opacity-50 transition-colors rounded text-sm font-medium'

interface SurveyEditorPageBlockProps {
  page: PageNode
  index: number
  className?: string
}

export function SurveyEditorPageBlock({
  page,
  index,
  className
}: SurveyEditorPageBlockProps) {
  const dispatch = useAppDispatch()
  const t = useTranslations('surveys.edit.pages')
  const tForm = useTranslations('form')

  const handleTitleChange = useCallback(
    (value: string) =>
      dispatch(updatePage({ pageId: page.id, patch: { title: value } })),
    [dispatch, page.id]
  )

  const handleOpenSettings = useCallback(
    () => dispatch(setSelection(page.id)),
    [dispatch, page.id]
  )

  const displayIndex = index + 1

  return (
    <div
      className={cn('flex flex-col gap-0', className)}
      data-block="page"
      data-page-id={page.id}
    >
      {/* Séparateur avec encart central : Page X, titre, paramètres */}
      <div className="flex w-full items-center gap-3 py-2">
        <Separator className="flex-1" />
        <div className="border-border bg-card flex max-w-[80%] min-w-48 shrink-0 items-center gap-2 rounded-full border py-1 pr-1 pl-4 shadow-sm lg:max-w-[50%]">
          <span
            className="text-muted-foreground shrink-0 text-xs font-medium"
            aria-hidden
          >
            {t('pageNumber', { number: displayIndex })}
          </span>
          <PageTitleInput
            value={page.title ?? ''}
            placeholder={t('noTitle')}
            aria-label={tForm('inputs.title.label')}
            onChange={handleTitleChange}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground hover:text-foreground shrink-0 rounded-full"
                aria-label={t('pageSettings')}
                onClick={handleOpenSettings}
              >
                <Settings className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('pageSettings')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Separator className="flex-1" />
      </div>

      {/* Zone des nodes (questions, blocs…) */}
      <div
        className="border-border bg-muted/20 min-h-[60px] rounded-md border border-dashed p-3"
        data-page-nodes-root={page.id}
      >
        <p className="text-muted-foreground text-xs">{t('nodesPlaceholder')}</p>
      </div>
    </div>
  )
}

interface PageTitleInputProps {
  value: string
  placeholder: string
  'aria-label': string
  onChange: (value: string) => void
}

function PageTitleInput({
  value,
  placeholder,
  'aria-label': ariaLabel,
  onChange
}: PageTitleInputProps) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )

  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      aria-label={ariaLabel}
      spellCheck={false}
      className={cn(pageTitleInputClass)}
      onChange={handleChange}
    />
  )
}
