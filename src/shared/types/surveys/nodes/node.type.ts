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
  code: string | null
  condition: Condition | null
  triggers: TriggerRule[]
}

export type Node = PageNode | GroupNode | QuestionNode | InfoNode | DividerNode

export type ChildNode = Exclude<Node, PageNode>
