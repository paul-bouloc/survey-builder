import type { NodeId } from '@/shared/types/brands.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'

/** Renvoie le tableau d'enfants qui contient le node avec nodeId et son index, ou null. */
export function findNodeParentInTree(
  nodes: Node[],
  nodeId: NodeId
): { parent: Node[]; index: number } | null {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === nodeId) return { parent: nodes, index: i }
    const withChildren = nodes[i] as Node & { children?: Node[] }
    if (Array.isArray(withChildren.children)) {
      const found = findNodeParentInTree(withChildren.children, nodeId)
      if (found) return found
    }
  }
  return null
}
