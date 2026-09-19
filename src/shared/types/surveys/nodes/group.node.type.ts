import {
  BaseNode,
  ChildNode,
  NodeKind
} from '@/shared/types/surveys/nodes/node.type'

export interface GroupNode extends BaseNode {
  kind: typeof NodeKind.GROUP
  children: ChildNode[]
  group: {
    title: string
    description: string
  }
}
