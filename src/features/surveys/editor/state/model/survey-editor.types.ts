import type { NodeId } from '@/shared/types/brands.type'
import type { Survey } from '@/shared/types/surveys/survey.type'
import type { BaseNode } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { SurveyDraft } from './survey-draft.type'

export type EditorPhase = 'idle' | 'loading' | 'success' | 'forbidden' | 'error'

export const SaveStatus = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error'
} as const

export type SaveStatus = (typeof SaveStatus)[keyof typeof SaveStatus]

export type SurveyMetaPatch = Partial<
  Pick<Survey, 'title' | 'subtitle' | 'description'>
>

export type SurveyPagePatch = Partial<
  Pick<PageNode, 'title' | 'subtitle' | 'description'>
> & {
  page?: Partial<Pick<PageNode['page'], 'skippable'>>
}

/** Champs éditables d'un node (base) pour l'éditeur. */
export type SurveyNodePatch = Partial<
  Pick<BaseNode, 'title' | 'subtitle' | 'description'>
>

/** Patch unifié pour un item (page ou node) : champs communs + page.skippable si page + config question. */
export type SurveyItemPatch = SurveyNodePatch & {
  page?: Partial<Pick<PageNode['page'], 'skippable'>>
  /** Partie config des questions (min, max, step, placeholder, etc.). Appliquée côté reducer si support. */
  config?: Record<string, unknown>
}

export interface SurveyEditorData {
  draft: SurveyDraft | null
}

export interface SurveyEditorUi {
  selectedNodeId: NodeId | null
}

export interface SurveyEditorStatus {
  phase: EditorPhase
  isDirty: boolean
  saveStatus: SaveStatus
  lastSavedAt: string | null
  /**
   * Incrémentée par toute mutation du draft. Une sauvegarde mémorise la révision
   * qu'elle envoie : au retour, `isDirty` n'est levé que si la révision n'a pas
   * bougé entre-temps, sinon les frappes faites pendant la requête seraient
   * considérées comme déjà sauvegardées.
   */
  revision: number
}

export interface SurveyEditorState {
  data: SurveyEditorData
  ui: SurveyEditorUi
  status: SurveyEditorStatus
}
