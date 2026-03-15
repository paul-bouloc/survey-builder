import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import { QuestionType } from '@/shared/types/surveys/nodes/question.node.type'
import { SettingsPanelQuestionNumberComponent } from './panels/settings-panel-question-number.component'
import { SettingsPanelQuestionRadioComponent } from './panels/settings-panel-question-radio.component'
import { SettingsPanelQuestionScaleComponent } from './panels/settings-panel-question-scale.component'
import { SettingsPanelQuestionSelectComponent } from './panels/settings-panel-question-select.component'
import { SettingsPanelQuestionTextComponent } from './panels/settings-panel-question-text.component'
import { SettingsPanelQuestionTextareaComponent } from './panels/settings-panel-question-textarea.component'

interface QuestionSettingsRouterProps {
  node: QuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function QuestionSettingsRouter({
  node,
  onPatch
}: QuestionSettingsRouterProps) {
  switch (node.type) {
    case QuestionType.TEXT:
      return (
        <SettingsPanelQuestionTextComponent node={node} onPatch={onPatch} />
      )
    case QuestionType.TEXTAREA:
      return (
        <SettingsPanelQuestionTextareaComponent node={node} onPatch={onPatch} />
      )
    case QuestionType.NUMBER:
      return (
        <SettingsPanelQuestionNumberComponent node={node} onPatch={onPatch} />
      )
    case QuestionType.RADIO:
      return (
        <SettingsPanelQuestionRadioComponent node={node} onPatch={onPatch} />
      )
    case QuestionType.SELECT:
      return (
        <SettingsPanelQuestionSelectComponent node={node} onPatch={onPatch} />
      )
    case QuestionType.SCALE:
      return (
        <SettingsPanelQuestionScaleComponent node={node} onPatch={onPatch} />
      )
    default:
      return null
  }
}
