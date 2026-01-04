import { NodeId } from '@/shared/types/brands.type'
import { Condition } from '@/shared/types/surveys/condition.type'
import { DividerNode } from '@/shared/types/surveys/nodes/divider.node.type'
import { GroupNode } from '@/shared/types/surveys/nodes/group.node.type'
import { InfoNode } from '@/shared/types/surveys/nodes/info.node.type'
import { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import { TriggerRule } from '@/shared/types/surveys/trigger.type'

export const NodeKind = {
  PAGE: 'page',
  GROUP: 'group',
  QUESTION: 'question',
  INFO: 'info',
  DIVIDER: 'divider'
} as const

export type NodeKind = (typeof NodeKind)[keyof typeof NodeKind]

export interface BaseNode {
  id: NodeId
  kind: NodeKind
  order: number

  title: string | null
  subtitle: string | null
  description: string | null

  /**
   * Optional stable code for "special questions" / reporting.
   * Example: "IMMEDIATE_RISK", "CONSENT", etc.
   */
  code: string | null

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
