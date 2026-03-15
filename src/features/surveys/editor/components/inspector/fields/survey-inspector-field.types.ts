import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type { BaseNode } from '@/shared/types/surveys/nodes/node.type'

/** Props communes aux champs de l'inspector : node + callback de patch (nodeId déjà bindé plus haut). */
export interface SurveyInspectorFieldProps {
  node: BaseNode
  onPatch: (patch: SurveyItemPatch) => void
}
