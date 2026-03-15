import type { NodeId } from '@/shared/types/brands.type'
import type { Survey } from '@/shared/types/surveys/survey.type'
import type { BaseNode } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'

export type EditorPhase = 'idle' | 'loading' | 'success' | 'forbidden' | 'error'

export type SurveyMetaPatch = Partial<
  Pick<Survey, 'title' | 'subtitle' | 'description'>
>

export type SurveyPagePatch = Partial<
  Pick<PageNode, 'title' | 'subtitle' | 'description'>
> & {
  page?: Partial<Pick<PageNode['page'], 'skippable'>>
}

/** Champs éditables d’un node (base) pour l’éditeur. */
export type SurveyNodePatch = Partial<
  Pick<BaseNode, 'title' | 'subtitle' | 'description'>
>

/** Patch unifié pour un item (page ou node) : champs communs + page.skippable si page. */
export type SurveyItemPatch = SurveyNodePatch & {
  page?: Partial<Pick<PageNode['page'], 'skippable'>>
}

export interface SurveyEditorData {
  survey: Survey | null
}

export interface SurveyEditorUi {
  selectedNodeId: NodeId | null
}

export interface SurveyEditorStatus {
  phase: EditorPhase
  isDirty: boolean
}

export interface SurveyEditorState {
  data: SurveyEditorData
  ui: SurveyEditorUi
  status: SurveyEditorStatus
}
