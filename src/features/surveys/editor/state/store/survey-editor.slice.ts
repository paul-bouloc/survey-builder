import type { NodeId } from '@/shared/types/brands.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { Survey } from '@/shared/types/surveys/survey.type'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createPageNode, createQuestionNode } from '../factories'
import { surveyToDraft } from '../mappers'
import type {
  SurveyEditorState,
  SurveyItemPatch,
  SurveyMetaPatch
} from '../model/survey-editor.types'
import { sanitizeSurveyMetaPatch, sanitizeSurveyNodePatch } from '../sanitizers'
import { findNodeInSurvey, reindexNodes, removeNodeFromPages } from '../tree'

const getInitialState = (): SurveyEditorState => ({
  data: {
    draft: null
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
      state.data.draft = null
      state.ui.selectedNodeId = null
      state.status.isDirty = false
    },
    loadSuccess(state, action: { payload: Survey }) {
      state.data.draft = surveyToDraft(action.payload)
      state.status.phase = 'success'
      state.status.isDirty = false
    },
    loadForbidden(state) {
      state.status.phase = 'forbidden'
      state.data.draft = null
    },
    loadError(state) {
      state.status.phase = 'error'
      state.data.draft = null
    },
    resetEditor() {
      return getInitialState()
    },

    updateSurveyMeta(state, action: PayloadAction<SurveyMetaPatch>) {
      if (!state.data.draft) return
      const patch = sanitizeSurveyMetaPatch(action.payload)
      if (patch.title !== undefined) state.data.draft.title = patch.title
      if (patch.subtitle !== undefined)
        state.data.draft.subtitle = patch.subtitle
      if (patch.description !== undefined)
        state.data.draft.description = patch.description
      state.status.isDirty = true
    },

    setSelection(state, action: PayloadAction<NodeId | null>) {
      state.ui.selectedNodeId = action.payload
    },

    addPage(state) {
      if (!state.data.draft) return
      const order = state.data.draft.pages.length
      state.data.draft.pages.push(createPageNode(order))
      state.status.isDirty = true
    },

    addNode(state, action: PayloadAction<{ pageId: NodeId }>) {
      if (!state.data.draft) return
      const { pageId } = action.payload
      const page = state.data.draft.pages.find(p => p.id === pageId)
      if (!page) return
      const order = page.children.length
      page.children.push(createQuestionNode(order))
      reindexNodes(page.children)
      state.status.isDirty = true
    },

    updateNode(
      state,
      action: PayloadAction<{ nodeId: NodeId; patch: SurveyItemPatch }>
    ) {
      if (!state.data.draft) return
      const { nodeId, patch } = action.payload
      const { pages } = state.data.draft
      const node = findNodeInSurvey(pages, nodeId)
      if (!node) return
      const sanitized = sanitizeSurveyNodePatch(patch)
      if (sanitized.title !== undefined) node.title = sanitized.title
      if (sanitized.subtitle !== undefined) node.subtitle = sanitized.subtitle
      if (sanitized.description !== undefined)
        node.description = sanitized.description
      if (node.kind === NodeKind.PAGE && patch.page?.skippable !== undefined) {
        ;(node as PageNode).page.skippable = patch.page.skippable
      }
      state.status.isDirty = true
    },

    removeNode(state, action: PayloadAction<NodeId>) {
      if (!state.data.draft) return
      const nodeId = action.payload
      const removed = removeNodeFromPages(state.data.draft.pages, nodeId)
      if (removed && state.ui.selectedNodeId === nodeId) {
        state.ui.selectedNodeId = null
      }
      if (removed) state.status.isDirty = true
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
  addNode,
  updateNode,
  removeNode
} = surveyEditorSlice.actions
