import type { NodeId } from '@/shared/types/brands.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'

/** Parcourt l'arbre de nodes récursivement et renvoie le premier node dont l'id correspond. */
export function findNodeInTree(nodes: Node[], nodeId: NodeId): Node | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node
    const withChildren = node as Node & { children?: Node[] }
    if (Array.isArray(withChildren.children)) {
      const found = findNodeInTree(withChildren.children, nodeId)
      if (found) return found
    }
  }
  return null
}

/**
 * Trouve un node par id dans tout le survey (page ou n'importe quel enfant / sous-node).
 * Moteur générique : pages, nodes, sub-nodes sont traités uniformément.
 */
export function findNodeInSurvey(
  pages: PageNode[],
  nodeId: NodeId
): Node | null {
  const page = pages.find(p => p.id === nodeId)
  if (page) return page
  for (const p of pages) {
    const node = findNodeInTree(p.children, nodeId)
    if (node) return node
  }
  return null
}

/**
 * Renvoie la page qui contient le node d'id donné (la page elle-même si nodeId est une page,
 * sinon la page dont l'arbre contient ce node).
 */
export function getPageContainingNode(
  pages: PageNode[],
  nodeId: NodeId
): PageNode | null {
  const page = pages.find(p => p.id === nodeId)
  if (page) return page
  for (const p of pages) {
    if (findNodeInTree(p.children, nodeId)) return p
  }
  return null
}
