import { BaseNode, Node } from '@/shared/types/nodes/node.type'

/** Root step = one page/screen in a multi-step survey */
export interface PageNode extends BaseNode {
  kind: 'page'
  children: Node[]
  page: {
    skippable: boolean
  }
}
