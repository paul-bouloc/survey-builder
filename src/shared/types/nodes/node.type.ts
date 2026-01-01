import { NodeId } from '@/shared/types/brands.type'
import { Condition } from '@/shared/types/nodes/condition.type'
import { DividerNode } from '@/shared/types/nodes/divider-node.type'
import { GroupNode } from '@/shared/types/nodes/group-node.type'
import { InfoNode } from '@/shared/types/nodes/info-node.type'
import { NodeKind } from '@/shared/types/nodes/node-kind.type'
import { PageNode } from '@/shared/types/nodes/page-node.type'
import { QuestionNode } from '@/shared/types/nodes/question/question-node.type'
import { TriggerRule } from '@/shared/types/nodes/trigger-rule.type'

export interface BaseNode {
  id: NodeId
  kind: NodeKind

  title?: string
  subtitle?: string
  description?: string

  /**
   * Optional stable code for "special questions" / reporting.
   * Example: "IMMEDIATE_RISK", "CONSENT", etc.
   */
  code?: string

  /**
   * Visibility condition for this node itself.
   * If false => node is hidden (and engine may clear answers below it).
   */
  condition: Condition | null

  /**
   * Triggers for actions from this node.
   * For a question, the engine evaluates triggers based on this question value.
   * For a group/page, you can use triggers with conditions referencing answers.
   */
  triggers: TriggerRule[]
}

export type Node = PageNode | GroupNode | QuestionNode | InfoNode | DividerNode
