import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { ScaleQuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import { NodeFieldMax, NodeFieldMin, NodeFieldStep } from '../fields'

interface SettingsPanelQuestionScaleComponentProps {
  node: ScaleQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelQuestionScaleComponent({
  node,
  onPatch
}: SettingsPanelQuestionScaleComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        <NodeFieldMin node={node} onPatch={onPatch} />
        <NodeFieldMax node={node} onPatch={onPatch} />
        <NodeFieldStep node={node} onPatch={onPatch} />
      </div>
    </div>
  )
}
