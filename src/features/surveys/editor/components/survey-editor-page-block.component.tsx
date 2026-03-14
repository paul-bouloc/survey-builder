import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  addNode,
  selectSelectedNodeId,
  setSelection,
  updatePage
} from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Plus, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, useCallback } from 'react'
import { SurveyEditorNodeBlock } from './survey-editor-node-block.component'

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
  const selectedNodeId = useAppSelector(selectSelectedNodeId)
  const t = useTranslations('surveys.edit.pages')
  const tForm = useTranslations('form')

  const handleTitleChange = useCallback(
    (value: string) =>
      dispatch(updatePage({ pageId: page.id, patch: { title: value } })),
    [dispatch, page.id]
  )

  const handleSelectPage = useCallback(
    () => dispatch(setSelection(page.id)),
    [dispatch, page.id]
  )

  const displayIndex = index + 1
  const isPageSelected = selectedNodeId === page.id

  return (
    <div
      className={cn('flex flex-col gap-0', className)}
      data-block="page"
      data-page-id={page.id}
      onClick={e => e.stopPropagation()}
    >
      {/* Séparateur avec encart central : Page X, titre, paramètres */}
      <div className="flex w-full items-center gap-3 py-2">
        <Separator className="flex-1" />
        <div
          className={cn(
            'border-border bg-card flex max-w-[80%] min-w-48 shrink-0 items-center gap-2 rounded-full border py-1 pr-1 pl-4 shadow-sm lg:max-w-[50%]',
            isPageSelected &&
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
            className={cn(pageTitleInputClass)}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleTitleChange(e.target.value)
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
                onClick={handleSelectPage}
                disabled={isPageSelected}
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
      <div className="flex flex-col gap-4 py-3" data-page-nodes-root={page.id}>
        {page.children.map(node => (
          <SurveyEditorNodeBlock
            key={node.id}
            pageId={page.id}
            node={node}
            isSelected={selectedNodeId === node.id}
          />
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full! bg-neutral-200/40! hover:bg-neutral-200/60! dark:bg-neutral-800/50! dark:hover:bg-neutral-800/70!"
          onClick={() => dispatch(addNode({ pageId: page.id }))}
        >
          <Plus className="size-4 shrink-0" />
          {t('addNode')}
        </Button>
      </div>
    </div>
  )
}
