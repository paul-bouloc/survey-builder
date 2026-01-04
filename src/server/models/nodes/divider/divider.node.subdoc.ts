import type { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { IBaseNodeSubdoc } from '../node'

export interface IDividerNodeSubdoc extends IBaseNodeSubdoc {
  kind: typeof NodeKind.DIVIDER
}
