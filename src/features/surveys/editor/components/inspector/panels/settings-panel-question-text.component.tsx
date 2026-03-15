import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { TextQuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import {
  NodeFieldDescription,
  NodeFieldPlaceholder,
  NodeFieldSubtitle,
  NodeFieldTitle
} from '../fields'

interface SettingsPanelQuestionTextComponentProps {
  node: TextQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelQuestionTextComponent({
  node,
  onPatch
}: SettingsPanelQuestionTextComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <NodeFieldTitle node={node} onPatch={onPatch} />
      <NodeFieldSubtitle node={node} onPatch={onPatch} />
      <NodeFieldDescription node={node} onPatch={onPatch} />
      <NodeFieldPlaceholder node={node} onPatch={onPatch} />
    </div>
  )
}
