import { SurveyEditorNodeBlockActions } from '@/features/surveys/editor/components/nodes/survey-editor-node-block-actions.component'
import { SurveyEditorNodeKindBadge } from '@/features/surveys/editor/components/nodes/survey-editor-node-kind-badge.component'
import { surveyNodeConfig } from '@/features/surveys/editor/config/survey-node.config'
import {
  removeNode,
  setSelection,
  updateNode
} from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import type { NodeId } from '@/shared/types/brands.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import { useAppDispatch } from '@/store/hooks'
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
      <SurveyEditorNodeKindBadge node={node} />

      {/* Node content */}
      <div className="flex w-full items-center gap-2">
        <input
          type="text"
          value={node.title ?? ''}
          placeholder={t('noTitle')}
          aria-label={t('noTitle')}
          maxLength={surveyNodeConfig.title.maxLength}
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

      <SurveyEditorNodeBlockActions
        isSelected={isSelected}
        onSettingsClick={handleSelect}
        onDeleteClick={handleRemove}
      />
    </div>
  )
}
