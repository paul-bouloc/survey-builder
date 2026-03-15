import type { NodeId } from '@/shared/types/brands.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { RootState } from '@/store'
import { findNodeInSurvey, getPageContainingNode } from '../tree'

const selectSurveyEditorState = (state: RootState) => state.surveyEditor

export const selectSurveyEditorData = (state: RootState) =>
  selectSurveyEditorState(state).data

export const selectSurveyEditorUi = (state: RootState) =>
  selectSurveyEditorState(state).ui

export const selectSurveyEditorStatus = (state: RootState) =>
  selectSurveyEditorState(state).status

export const selectDraft = (state: RootState) =>
  selectSurveyEditorData(state).draft

export const selectEditorPhase = (state: RootState) =>
  selectSurveyEditorStatus(state).phase

export const selectIsEditable = (state: RootState) =>
  selectEditorPhase(state) === 'success'

export const selectSelectedNodeId = (state: RootState) =>
  selectSurveyEditorUi(state).selectedNodeId

export const selectSurveyMeta = (state: RootState) => {
  const draft = selectDraft(state)
  if (!draft) return null
  return {
    title: draft.title,
    subtitle: draft.subtitle,
    description: draft.description
  }
}

export const selectEditorPages = (state: RootState) => {
  const draft = selectDraft(state)
  return draft?.pages ?? []
}

export const selectEditorPageById = (pageId: NodeId) => (state: RootState) => {
  const draft = selectDraft(state)
  return draft?.pages.find(p => p.id === pageId) ?? null
}

export const selectIsDirty = (state: RootState) =>
  selectSurveyEditorStatus(state).isDirty

export const selectSelectedItem = (state: RootState): Node | null => {
  const pages = selectEditorPages(state)
  const nodeId = selectSelectedNodeId(state)
  return nodeId ? (findNodeInSurvey(pages, nodeId) ?? null) : null
}

export const selectSelectedItemPage = (state: RootState): PageNode | null => {
  const pages = selectEditorPages(state)
  const nodeId = selectSelectedNodeId(state)
  return nodeId ? getPageContainingNode(pages, nodeId) : null
}
