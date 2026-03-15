import { SurveyEditorAddBlockButton } from '@/features/surveys/editor/components/nodes/survey-editor-add-block-button.component'
import {
  selectSelectedNodeId,
  setSelection,
  updateNode
} from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
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

  const handleTitleChange = useCallback(
    (value: string) =>
      dispatch(updateNode({ nodeId: page.id, patch: { title: value } })),
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
            node={node}
            isSelected={selectedNodeId === node.id}
          />
        ))}

        <SurveyEditorAddBlockButton page={page} />
      </div>
    </div>
  )
}
