import {
  BaseNode,
  ChildNode,
  NodeKind
} from '@/shared/types/surveys/nodes/node.type'

/** Root step = one page/screen in a multi-step survey */
export interface PageNode extends BaseNode {
  kind: typeof NodeKind.PAGE
  children: ChildNode[]
  page: {
    skippable: boolean
  }
}
