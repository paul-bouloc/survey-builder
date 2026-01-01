import { BaseNode, NodeKind } from '@/shared/types/surveys/nodes/node.type'

export interface InfoNode extends BaseNode {
  kind: typeof NodeKind.INFO
  info: {
    type: 'info' | 'warning' | 'error' | 'success' | 'neutral'
    title: string
    description: string
  }
}
