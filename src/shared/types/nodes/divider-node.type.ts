import { BaseNode } from '@/shared/types/nodes/node.type'

export interface DividerNode extends BaseNode {
  kind: 'divider'
  divider?: {
    spacing?: 'sm' | 'md' | 'lg'
  }
}
