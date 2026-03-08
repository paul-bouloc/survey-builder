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

export const selectSelectedNodeId = (state: RootState) =>
  selectSurveyEditorUi(state).selectedNodeId

export const selectIsEditorInitialized = (state: RootState) =>
  selectSurveyEditorStatus(state).isInitialized
