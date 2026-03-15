import type { ShortId } from '@/shared/types/brands.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'

/**
 * Modèle d'édition du survey : uniquement les champs nécessaires à l'éditeur.
 * Découplé du modèle API (Survey).
 */
export interface SurveyDraft {
  shortId: ShortId
  title: string
  subtitle?: string
  description?: string
  pages: PageNode[]
}
