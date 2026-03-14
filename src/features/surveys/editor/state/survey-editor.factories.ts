import type { NodeId } from '@/shared/types/brands.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'

export function createPageNode(order: number): PageNode {
  return {
    id: crypto.randomUUID() as NodeId,
    kind: NodeKind.PAGE,
    order,
    title: null,
    subtitle: null,
    description: null,
    code: null,
    condition: null,
    triggers: [],
    children: [],
    page: { skippable: false }
  }
}
