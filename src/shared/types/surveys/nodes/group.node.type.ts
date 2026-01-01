import {
  BaseNode,
  Node,
  NodeKind
} from '@/shared/types/surveys/nodes/node.type'

export interface GroupNode extends BaseNode {
  kind: typeof NodeKind.GROUP
  children: Node[]
  group: {
    title: string
    description: string
  }
}
