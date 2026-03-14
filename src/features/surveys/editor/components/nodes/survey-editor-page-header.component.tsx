import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type ChangeEvent } from 'react'

interface SurveyEditorPageHeaderProps {
  page: PageNode
  index: number
  isSelected: boolean
  onTitleChange: (value: string) => void
  onSelectPage: () => void
}

export function SurveyEditorPageHeader({
  page,
  index,
  isSelected,
  onTitleChange,
  onSelectPage
}: SurveyEditorPageHeaderProps) {
  const t = useTranslations('surveys.edit.pages')
  const tForm = useTranslations('form')
  const displayIndex = index + 1

  return (
    <div className="flex w-full items-center gap-3 py-2">
      <Separator className="flex-1" />
      <div
        className={cn(
          'border-border bg-card flex w-64 shrink-0 items-center gap-2 rounded-full border py-1 pr-1 pl-4 lg:max-w-[50%]',
          isSelected &&
            'border-primary/60 ring-primary/20 dark:ring-primary/20 ring-4'
        )}
      >
        <span
          className="text-muted-foreground shrink-0 text-xs font-medium"
          aria-hidden
        >
          {t('pageNumber', { number: displayIndex })}
        </span>

        <input
          type="text"
          value={page.title ?? ''}
          placeholder={t('noTitle')}
          aria-label={tForm('inputs.title.label')}
          spellCheck={false}
          className="placeholder:text-muted-foreground min-w-0 flex-1 truncate rounded border-0 bg-transparent p-0 text-sm font-medium shadow-none transition-colors outline-none placeholder:opacity-50 focus:ring-0 focus-visible:ring-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onTitleChange(e.target.value)
          }
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-foreground shrink-0 rounded-full"
              aria-label={t('pageSettings')}
              onClick={onSelectPage}
              disabled={isSelected}
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
  )
}
