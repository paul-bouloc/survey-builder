import type { NodeId } from '@/shared/types/brands.type'
import type { Survey } from '@/shared/types/surveys/survey.type'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {
  SurveyEditorState,
  SurveyMetaPatch,
  SurveyNodePatch,
  SurveyPagePatch
} from './survey-editor.types'
import { createPageNode, createQuestionNode } from './survey-editor.factories'
import { reindexPages, reindexNodes } from './survey-editor.utils'

const getInitialState = (): SurveyEditorState => ({
  data: {
    survey: null
  },
  ui: {
    selectedNodeId: null
  },
  status: {
    phase: 'idle',
    isDirty: false
  }
})

const surveyEditorSlice = createSlice({
  name: 'surveyEditor',
  initialState: getInitialState(),
  reducers: {
    loadStart(state) {
      state.status.phase = 'loading'
      state.data.survey = null
      state.ui.selectedNodeId = null
      state.status.isDirty = false
    },
    loadSuccess(state, action: { payload: Survey }) {
      state.data.survey = action.payload
      state.status.phase = 'success'
      state.status.isDirty = false
    },
    loadForbidden(state) {
      state.status.phase = 'forbidden'
      state.data.survey = null
    },
    loadError(state) {
      state.status.phase = 'error'
      state.data.survey = null
    },
    resetEditor() {
      return getInitialState()
    },
    updateSurveyMeta(state, action: PayloadAction<SurveyMetaPatch>) {
      if (!state.data.survey) return
      const patch = action.payload
      if (patch.title !== undefined) {
        state.data.survey.title = patch.title
      }
      if (patch.subtitle !== undefined) {
        state.data.survey.subtitle = patch.subtitle
      }
      if (patch.description !== undefined) {
        state.data.survey.description = patch.description
      }
      state.status.isDirty = true
    },
    setSelection(state, action: PayloadAction<NodeId | null>) {
      state.ui.selectedNodeId = action.payload
    },

    addPage(state) {
      if (!state.data.survey) return
      const order = state.data.survey.pages.length
      state.data.survey.pages.push(createPageNode(order))
      state.status.isDirty = true
    },

    updatePage(
      state,
      action: PayloadAction<{ pageId: NodeId; patch: SurveyPagePatch }>
    ) {
      if (!state.data.survey) return
      const { pageId, patch } = action.payload
      const page = state.data.survey.pages.find(p => p.id === pageId)
      if (!page) return
      if (patch.title !== undefined) page.title = patch.title
      if (patch.subtitle !== undefined) page.subtitle = patch.subtitle
      if (patch.description !== undefined) page.description = patch.description
      if (patch.page?.skippable !== undefined) {
        page.page.skippable = patch.page.skippable
      }
      state.status.isDirty = true
    },

    removePage(state, action: PayloadAction<NodeId>) {
      if (!state.data.survey) return
      const pageId = action.payload
      const idx = state.data.survey.pages.findIndex(p => p.id === pageId)
      if (idx === -1) return
      state.data.survey.pages.splice(idx, 1)
      reindexPages(state.data.survey.pages)
      state.status.isDirty = true
    },

    addNode(state, action: PayloadAction<{ pageId: NodeId }>) {
      if (!state.data.survey) return
      const { pageId } = action.payload
      const page = state.data.survey.pages.find(p => p.id === pageId)
      if (!page) return
      const order = page.children.length
      page.children.push(createQuestionNode(order))
      reindexNodes(page.children)
      state.status.isDirty = true
    },

    updateNode(
      state,
      action: PayloadAction<{
        pageId: NodeId
        nodeId: NodeId
        patch: SurveyNodePatch
      }>
    ) {
      if (!state.data.survey) return
      const { pageId, nodeId, patch } = action.payload
      const page = state.data.survey.pages.find(p => p.id === pageId)
      if (!page) return
      const node = page.children.find(n => n.id === nodeId)
      if (!node) return
      if (patch.title !== undefined) node.title = patch.title
      if (patch.subtitle !== undefined) node.subtitle = patch.subtitle
      if (patch.description !== undefined) node.description = patch.description
      state.status.isDirty = true
    },

    removeNode(
      state,
      action: PayloadAction<{ pageId: NodeId; nodeId: NodeId }>
    ) {
      if (!state.data.survey) return
      const { pageId, nodeId } = action.payload
      const page = state.data.survey.pages.find(p => p.id === pageId)
      if (!page) return
      const idx = page.children.findIndex(n => n.id === nodeId)
      if (idx === -1) return
      page.children.splice(idx, 1)
      reindexNodes(page.children)
      if (state.ui.selectedNodeId === nodeId) {
        state.ui.selectedNodeId = null
      }
      state.status.isDirty = true
    }
  }
})

export const surveyEditorReducer = surveyEditorSlice.reducer
export const {
  loadStart,
  loadSuccess,
  loadForbidden,
  loadError,
  resetEditor,
  updateSurveyMeta,
  setSelection,
  addPage,
  updatePage,
  removePage,
  addNode,
  updateNode,
  removeNode
} = surveyEditorSlice.actions
