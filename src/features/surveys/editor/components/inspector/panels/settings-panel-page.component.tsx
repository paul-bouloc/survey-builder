import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { NodeFieldTitle } from '../fields'

interface SettingsPanelPageComponentProps {
  node: PageNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelPageComponent({
  node,
  onPatch
}: SettingsPanelPageComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <NodeFieldTitle node={node} onPatch={onPatch} />
    </div>
  )
}
