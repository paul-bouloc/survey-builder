import { BaseNode, NodeKind } from '@/shared/types/surveys/nodes/node.type'

export interface DividerNode extends BaseNode {
  kind: typeof NodeKind.DIVIDER
}
