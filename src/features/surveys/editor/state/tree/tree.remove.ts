import type { NodeId } from '@/shared/types/brands.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { getPageContainingNode } from './tree.find'
import { findNodeParentInTree } from './tree.parent'
import { reindexNodes, reindexPages } from './tree.order'

/**
 * Supprime un node du survey (page ou enfant de page).
 * Mutate les tableaux en place et réindexe. Retourne true si le node a été supprimé.
 */
export function removeNodeFromPages(
  pages: PageNode[],
  nodeId: NodeId
): boolean {
  const pageIndex = pages.findIndex(p => p.id === nodeId)
  if (pageIndex !== -1) {
    pages.splice(pageIndex, 1)
    reindexPages(pages)
    return true
  }
  const page = getPageContainingNode(pages, nodeId)
  if (!page) return false
  const found = findNodeParentInTree(page.children, nodeId)
  if (!found) return false
  const { parent, index } = found
  parent.splice(index, 1)
  reindexNodes(parent)
  return true
}
