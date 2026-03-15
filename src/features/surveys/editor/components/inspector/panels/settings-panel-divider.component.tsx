import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { DividerNode } from '@/shared/types/surveys/nodes/divider.node.type'

interface SettingsPanelDividerComponentProps {
  node: DividerNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelDividerComponent({
  node,
  onPatch
}: SettingsPanelDividerComponentProps) {
  if (!node || !onPatch) {
    return null
  }

  return null
}
