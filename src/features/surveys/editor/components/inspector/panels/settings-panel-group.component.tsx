import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { GroupNode } from '@/shared/types/surveys/nodes/group.node.type'
import { NodeFieldTitle } from '../fields'

interface SettingsPanelGroupComponentProps {
  node: GroupNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelGroupComponent({
  node,
  onPatch
}: SettingsPanelGroupComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <NodeFieldTitle node={node} onPatch={onPatch} />
    </div>
  )
}
