import { BaseNode } from '@/shared/types/nodes/node.type'

export interface GroupNode extends BaseNode {
  kind: 'group'
  children: Node[]
  group: {
    title: string
    description: string
  }
}
