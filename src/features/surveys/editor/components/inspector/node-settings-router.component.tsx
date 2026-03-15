import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import { SettingsPanelDividerComponent } from './panels/settings-panel-divider.component'
import { SettingsPanelGroupComponent } from './panels/settings-panel-group.component'
import { SettingsPanelInfoComponent } from './panels/settings-panel-info.component'
import { SettingsPanelPageComponent } from './panels/settings-panel-page.component'
import { QuestionSettingsRouter } from './question-settings-router.component'

interface NodeSettingsRouterProps {
  node: Node
  onPatch: (patch: SurveyItemPatch) => void
}

export function NodeSettingsRouter({ node, onPatch }: NodeSettingsRouterProps) {
  switch (node.kind) {
    case NodeKind.PAGE:
      return <SettingsPanelPageComponent node={node} onPatch={onPatch} />
    case NodeKind.QUESTION:
      return (
        <QuestionSettingsRouter node={node as QuestionNode} onPatch={onPatch} />
      )
    case NodeKind.GROUP:
      return <SettingsPanelGroupComponent node={node} onPatch={onPatch} />
    case NodeKind.INFO:
      return <SettingsPanelInfoComponent node={node} onPatch={onPatch} />
    case NodeKind.DIVIDER:
      return <SettingsPanelDividerComponent node={node} onPatch={onPatch} />
    default:
      return null
  }
}
