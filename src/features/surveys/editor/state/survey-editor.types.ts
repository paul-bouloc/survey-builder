import type { NodeId } from '@/shared/types/brands.type'
import type { Survey } from '@/shared/types/surveys/survey.type'

export type EditorPhase = 'idle' | 'loading' | 'success' | 'forbidden' | 'error'

export type SurveyMetaPatch = Partial<
  Pick<Survey, 'title' | 'subtitle' | 'description'>
>

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
