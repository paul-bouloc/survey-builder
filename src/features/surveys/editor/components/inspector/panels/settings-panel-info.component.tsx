import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { InfoNode } from '@/shared/types/surveys/nodes/info.node.type'
import { NodeFieldTitle } from '../fields'

interface SettingsPanelInfoComponentProps {
  node: InfoNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelInfoComponent({
  node,
  onPatch
}: SettingsPanelInfoComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <NodeFieldTitle node={node} onPatch={onPatch} />
    </div>
  )
}
