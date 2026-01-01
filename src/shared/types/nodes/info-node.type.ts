import { BaseNode } from '@/shared/types/nodes/node.type'

export interface InfoNode extends BaseNode {
  kind: 'info'
  info: {
    type: 'info' | 'warning' | 'error' | 'success' | 'neutral'
    title: string
    description: string
  }
}
