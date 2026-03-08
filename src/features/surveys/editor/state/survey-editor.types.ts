import type { NodeId } from '@/shared/types/brands.type'
import type { Survey } from '@/shared/types/surveys/survey.type'

export interface SurveyEditorData {
  survey: Survey | null
}

export interface SurveyEditorUi {
  selectedNodeId: NodeId | null
}

export interface SurveyEditorStatus {
  isInitialized: boolean
}

export interface SurveyEditorState {
  data: SurveyEditorData
  ui: SurveyEditorUi
  status: SurveyEditorStatus
}
