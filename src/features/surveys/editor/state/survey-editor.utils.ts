import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'

/** Met à jour le champ `order` de chaque page pour qu’il corresponde à son index. */
export function reindexPages(pages: PageNode[]): void {
  for (let i = 0; i < pages.length; i++) {
    pages[i].order = i
  }
}
