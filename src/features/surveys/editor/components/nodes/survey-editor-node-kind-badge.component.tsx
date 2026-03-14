import { SurveyEditorNodeKindIcon } from '@/features/surveys/editor/components/nodes/survey-editor-node-kind-icon.component'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import { useTranslations } from 'next-intl'

interface SurveyEditorNodeKindBadgeProps {
  node: Node
}

export function SurveyEditorNodeKindBadge({
  node
}: SurveyEditorNodeKindBadgeProps) {
  const t = useTranslations('surveys.edit.nodes')

  const questionType =
    node.kind === NodeKind.QUESTION ? (node as QuestionNode).type : undefined

  const label =
    questionType !== undefined
      ? t(`questionType.${questionType}`)
      : t(`kind.${node.kind}`)

  return (
    <div className="flex w-full items-center gap-2">
      <div className="bg-primary/15 flex size-5 items-center justify-center rounded-sm">
        <SurveyEditorNodeKindIcon
          node={node}
          className="text-primary size-3.5"
        />
      </div>
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
    </div>
  )
}
