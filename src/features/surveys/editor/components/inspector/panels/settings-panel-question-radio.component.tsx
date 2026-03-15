import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { RadioQuestionNode } from '@/shared/types/surveys/nodes/question.node.type'

interface SettingsPanelQuestionRadioComponentProps {
  node: RadioQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function SettingsPanelQuestionRadioComponent({
  node,
  onPatch
}: SettingsPanelQuestionRadioComponentProps) {
  if (!node || !onPatch) {
    return null
  }

  // TODO: UI d'édition des options radio.
  return null
}
