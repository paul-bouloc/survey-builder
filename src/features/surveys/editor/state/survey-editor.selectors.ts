import type { NodeId } from '@/shared/types/brands.type'
import type { Node } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
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

/** Page actuellement sélectionnée (quand on a cliqué sur une page), ou null. */
export const selectSelectedPage = (state: RootState): PageNode | null => {
  const pages = selectEditorPages(state)
  const selectedNodeId = selectSelectedNodeId(state)
  if (!selectedNodeId) return null
  return pages.find(p => p.id === selectedNodeId) ?? null
}

/** Page qui contient le node actuellement sélectionné, ou null. */
export const selectPageContainingSelectedNode = (
  state: RootState
): PageNode | null => {
  const pages = selectEditorPages(state)
  const selectedNodeId = selectSelectedNodeId(state)
  if (!selectedNodeId) return null
  return pages.find(p => p.children.some(c => c.id === selectedNodeId)) ?? null
}

/** Node actuellement sélectionné, ou null. */
export const selectSelectedNode = (state: RootState): Node | null => {
  const page = selectPageContainingSelectedNode(state)
  const selectedNodeId = selectSelectedNodeId(state)
  if (!page || !selectedNodeId) return null
  return page.children.find(n => n.id === selectedNodeId) ?? null
}
