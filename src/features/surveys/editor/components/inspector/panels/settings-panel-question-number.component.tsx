import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { NumberQuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import {
  NodeFieldMax,
  NodeFieldMin,
  NodeFieldStep,
  NodeFieldTitle
} from '../fields'

interface SettingsPanelQuestionNumberComponentProps {
  node: NumberQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelQuestionNumberComponent({
  node,
  onPatch
}: SettingsPanelQuestionNumberComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <NodeFieldTitle node={node} onPatch={onPatch} />
      <div className="grid grid-cols-3 gap-2">
        <NodeFieldMin node={node} onPatch={onPatch} />
        <NodeFieldMax node={node} onPatch={onPatch} />
        <NodeFieldStep node={node} onPatch={onPatch} />
      </div>
    </div>
  )
}
