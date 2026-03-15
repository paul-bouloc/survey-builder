import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { SelectQuestionNode } from '@/shared/types/surveys/nodes/question.node.type'

interface SettingsPanelQuestionSelectComponentProps {
  node: SelectQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelQuestionSelectComponent({
  node,
  onPatch
}: SettingsPanelQuestionSelectComponentProps) {
  if (!node || !onPatch) {
    return null
  }

  // TODO: UI d'édition des options de select.
  return null
}
