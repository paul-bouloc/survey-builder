import type { NodeId } from '@/shared/types/brands.type'
import type { RootState } from '@/store'

const selectSurveyEditorState = (state: RootState) => state.surveyEditor

export const selectSurveyEditorData = (state: RootState) =>
  selectSurveyEditorState(state).data

export const selectSurveyEditorUi = (state: RootState) =>
  selectSurveyEditorState(state).ui

export const selectSurveyEditorStatus = (state: RootState) =>
  selectSurveyEditorState(state).status

export const selectSurvey = (state: RootState) =>
  selectSurveyEditorData(state).survey

export const selectEditorPhase = (state: RootState) =>
  selectSurveyEditorStatus(state).phase

export const selectIsEditable = (state: RootState) =>
  selectEditorPhase(state) === 'success'

export const selectSelectedNodeId = (state: RootState) =>
  selectSurveyEditorUi(state).selectedNodeId

export const selectSurveyMeta = (state: RootState) => {
  const survey = selectSurvey(state)
  if (!survey) return null
  return {
    title: survey.title,
    subtitle: survey.subtitle,
    description: survey.description
  }
}

export const selectEditorPages = (state: RootState) => {
  const survey = selectSurvey(state)
  return survey?.pages ?? []
}

export const selectEditorPageById = (pageId: NodeId) => (state: RootState) => {
  const survey = selectSurvey(state)
  return survey?.pages.find(p => p.id === pageId) ?? null
}

export const selectIsDirty = (state: RootState) =>
  selectSurveyEditorStatus(state).isDirty
