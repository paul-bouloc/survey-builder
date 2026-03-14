import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  removeNode,
  setSelection,
  updateNode
} from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import type { NodeId } from '@/shared/types/brands.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import { useAppDispatch } from '@/store/hooks'
import { Copy, Settings, Trash2, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, type ChangeEvent } from 'react'

interface SurveyEditorNodeBlockProps {
  pageId: NodeId
  node: Node
  isSelected: boolean
  className?: string
}

export function SurveyEditorNodeBlock({
  pageId,
  node,
  isSelected,
  className
}: SurveyEditorNodeBlockProps) {
  const dispatch = useAppDispatch()
  const t = useTranslations('surveys.edit.pages')
  const tCommon = useTranslations('surveys.edit.common')

  const handleSelect = useCallback(
    () => dispatch(setSelection(node.id)),
    [dispatch, node.id]
  )

  const handleTitleChange = useCallback(
    (value: string) =>
      dispatch(
        updateNode({ pageId, nodeId: node.id, patch: { title: value } })
      ),
    [dispatch, pageId, node.id]
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      dispatch(removeNode({ pageId, nodeId: node.id }))
    },
    [dispatch, pageId, node.id]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group/node border-border bg-card dark:ring-muted/40 relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 ring-0 ring-neutral-200/50 transition-all hover:ring-4',
        isSelected &&
          'border-primary/60 ring-primary/20 dark:ring-primary/20 ring-4',
        className
      )}
      data-block="node"
      data-node-id={node.id}
      onClick={e => {
        e.stopPropagation()
        handleSelect()
      }}
      onKeyDown={e => {
        const target = e.target as HTMLElement
        const isEditable =
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target.isContentEditable
        if (isEditable) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleSelect()
        }
      }}
    >
      {/* Node type and title */}
      <div className="flex w-full items-center gap-2">
        <div className="bg-primary/15 flex size-5 items-center justify-center rounded-sm">
          <Type className="text-primary size-3" />
        </div>
        <span className="text-muted-foreground text-sm font-medium">
          Question
        </span>
      </div>

      {/* Node content */}
      <div className="flex w-full items-center gap-2">
        <input
          type="text"
          value={node.title ?? ''}
          placeholder={t('noTitle')}
          aria-label={t('noTitle')}
          spellCheck={false}
          className={cn(
            'placeholder:text-muted-foreground min-w-0 flex-1 truncate rounded border-0 bg-transparent p-0 text-sm font-medium shadow-none transition-colors outline-none placeholder:opacity-50 focus:ring-0 focus-visible:ring-0'
          )}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleTitleChange(e.target.value)
          }
          onClick={e => e.stopPropagation()}
        />
      </div>

      {/* Actions */}
      <div className="bg-card absolute right-3 rounded-lg transition-all group-hover/node:right-3 group-hover/node:opacity-100 md:-top-3 md:right-0 md:opacity-0">
        <ButtonGroup aria-label={tCommon('actions')}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-xs"
                aria-label={tCommon('settings')}
                onClick={handleSelect}
                disabled={isSelected}
              >
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon('settings')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-xs"
                aria-label={tCommon('duplicate')}
              >
                <Copy />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon('duplicate')}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon-xs"
                onClick={handleRemove}
                aria-label={tCommon('delete')}
                className="hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon('delete')}</p>
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>
      </div>
    </div>
  )
}
