import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'

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
