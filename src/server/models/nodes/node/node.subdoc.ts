import type { NodeId } from '@/shared/types/brands.type'
import type { Condition } from '@/shared/types/surveys/condition.type'
import type { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { TriggerRule } from '@/shared/types/surveys/trigger.type'

export interface IBaseNodeSubdoc {
  id: NodeId
  kind: NodeKind
  order: number

  title: string | null
  subtitle: string | null
  description: string | null

  code: string | null

  condition: Condition | null
  triggers: TriggerRule[]
}
