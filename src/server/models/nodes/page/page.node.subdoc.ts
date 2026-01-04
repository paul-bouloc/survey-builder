import type { Node, NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { IBaseNodeSubdoc } from '../node'

export interface IPageNodeSubdoc extends IBaseNodeSubdoc {
  kind: typeof NodeKind.PAGE
  children: Node[]
  page: {
    skippable: boolean
  }
}
