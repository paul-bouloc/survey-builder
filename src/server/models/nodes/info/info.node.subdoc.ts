import type { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { IBaseNodeSubdoc } from '../node'

export interface IInfoNodeSubdoc extends IBaseNodeSubdoc {
  kind: typeof NodeKind.INFO
  info: {
    type: 'info' | 'warning' | 'error' | 'success' | 'neutral'
    title: string
    description: string
  }
}
