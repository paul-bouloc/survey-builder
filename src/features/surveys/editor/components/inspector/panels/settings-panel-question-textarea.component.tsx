import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { TextareaQuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import {
  NodeFieldDescription,
  NodeFieldPlaceholder,
  NodeFieldSubtitle,
  NodeFieldTitle
} from '../fields'

interface SettingsPanelQuestionTextareaComponentProps {
  node: TextareaQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelQuestionTextareaComponent({
  node,
  onPatch
}: SettingsPanelQuestionTextareaComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <NodeFieldTitle node={node} onPatch={onPatch} />
      <NodeFieldSubtitle node={node} onPatch={onPatch} />
      <NodeFieldDescription node={node} onPatch={onPatch} />
      <NodeFieldPlaceholder node={node} onPatch={onPatch} />
    </div>
  )
}
