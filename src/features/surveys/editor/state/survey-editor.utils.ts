import type { NodeId } from '@/shared/types/brands.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'

/** Parcourt l’arbre de nodes récursivement et renvoie le premier node dont l’id correspond. */
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
 * Trouve un node par id dans tout le survey (page ou n’importe quel enfant / sous-node).
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
 * Renvoie la page qui contient le node d’id donné (la page elle-même si nodeId est une page, sinon la page dont l’arbre contient ce node).
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

/** Renvoie le tableau d’enfants qui contient le node avec nodeId et son index, ou null. */
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

/** Met à jour le champ `order` de chaque page pour qu’il corresponde à son index. */
export function reindexPages(pages: PageNode[]): void {
  for (let i = 0; i < pages.length; i++) {
    pages[i].order = i
  }
}

/** Met à jour le champ `order` de chaque node pour qu’il corresponde à son index. */
export function reindexNodes(nodes: Node[]): void {
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].order = i
  }
}
