import { Button } from '@/components/ui/button'
import {
  addNode,
  selectSelectedNodeId,
  setSelection,
  updatePage
} from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { SurveyEditorNodeBlock } from './survey-editor-node-block.component'
import { SurveyEditorPageHeader } from './survey-editor-page-header.component'

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

  const handleTitleChange = useCallback(
    (value: string) =>
      dispatch(updatePage({ pageId: page.id, patch: { title: value } })),
    [dispatch, page.id]
  )

  const handleSelectPage = useCallback(
    () => dispatch(setSelection(page.id)),
    [dispatch, page.id]
  )

  const isPageSelected = selectedNodeId === page.id

  return (
    <div
      className={cn('flex flex-col gap-0', className)}
      data-block="page"
      data-page-id={page.id}
      onClick={e => e.stopPropagation()}
    >
      <SurveyEditorPageHeader
        page={page}
        index={index}
        isSelected={isPageSelected}
        onTitleChange={handleTitleChange}
        onSelectPage={handleSelectPage}
      />

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
