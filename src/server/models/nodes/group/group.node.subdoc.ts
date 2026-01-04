import type { Node, NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { IBaseNodeSubdoc } from '../node'

export interface IGroupNodeSubdoc extends IBaseNodeSubdoc {
  kind: typeof NodeKind.GROUP
  children: Node[]
  group: {
    title: string
    description: string
  }
}
