import type { NodeId } from '@/shared/types/brands.type'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import type { QuestionNode } from '@/shared/types/surveys/nodes/question.node.type'
import type { Survey } from '@/shared/types/surveys/survey.type'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  createDividerNode,
  createGroupNode,
  createInfoNode,
  createPageNode,
  createQuestionNode,
  createQuestionNodeByType
} from '../factories'
import { QuestionType } from '@/shared/types/surveys/nodes/question.node.type'
import { surveyToDraft } from '../mappers'
import {
  SaveStatus,
  type SurveyEditorState,
  type SurveyItemPatch,
  type SurveyMetaPatch
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
    isDirty: false,
    saveStatus: SaveStatus.IDLE,
    lastSavedAt: null,
    revision: 0
  }
})

/** Toute mutation du draft passe par ici : `isDirty` et `revision` restent solidaires. */
function markDirty(state: SurveyEditorState) {
  state.status.isDirty = true
  state.status.revision += 1
}

const surveyEditorSlice = createSlice({
  name: 'surveyEditor',
  initialState: getInitialState(),
  reducers: {
    loadStart(state) {
      state.status.phase = 'loading'
      state.data.draft = null
      state.ui.selectedNodeId = null
      state.status.isDirty = false
      state.status.saveStatus = SaveStatus.IDLE
      state.status.lastSavedAt = null
      state.status.revision = 0
    },
    loadSuccess(state, action: { payload: Survey }) {
      state.data.draft = surveyToDraft(action.payload)
      state.status.phase = 'success'
      state.status.isDirty = false
      state.status.saveStatus = SaveStatus.IDLE
      // `updatedAt` est la dernière écriture connue : le header peut dater le
      // brouillon dès l'ouverture, avant toute sauvegarde de la session.
      state.status.lastSavedAt = new Date(
        action.payload.updatedAt
      ).toISOString()
      state.status.revision = 0
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

    saveStart(state) {
      state.status.saveStatus = SaveStatus.SAVING
    },

    /**
     * `revision` est celle envoyée au serveur : si elle a bougé pendant la
     * requête, le draft contient des changements plus récents et reste dirty.
     */
    saveSuccess(
      state,
      action: PayloadAction<{ revision: number; savedAt: string }>
    ) {
      const { revision, savedAt } = action.payload
      state.status.lastSavedAt = savedAt
      if (state.status.revision === revision) {
        state.status.isDirty = false
        state.status.saveStatus = SaveStatus.SAVED
      } else {
        state.status.saveStatus = SaveStatus.IDLE
      }
    },

    saveFailure(state) {
      state.status.saveStatus = SaveStatus.ERROR
    },

    updateSurveyMeta(state, action: PayloadAction<SurveyMetaPatch>) {
      if (!state.data.draft) return
      const patch = sanitizeSurveyMetaPatch(action.payload)
      if (patch.title !== undefined) state.data.draft.title = patch.title
      if (patch.subtitle !== undefined)
        state.data.draft.subtitle = patch.subtitle
      if (patch.description !== undefined)
        state.data.draft.description = patch.description
      markDirty(state)
    },

    setSelection(state, action: PayloadAction<NodeId | null>) {
      state.ui.selectedNodeId = action.payload
    },

    addPage(state) {
      if (!state.data.draft) return
      const order = state.data.draft.pages.length
      state.data.draft.pages.push(createPageNode(order))
      markDirty(state)
    },

    addNode(
      state,
      action: PayloadAction<
        | { pageId: NodeId }
        | { pageId: NodeId; kind: 'group' }
        | { pageId: NodeId; kind: 'info' }
        | { pageId: NodeId; kind: 'divider' }
        | { pageId: NodeId; questionType: QuestionType }
      >
    ) {
      if (!state.data.draft) return
      const { pageId } = action.payload
      const page = state.data.draft.pages.find(p => p.id === pageId)
      if (!page) return
      const order = page.children.length
      if ('questionType' in action.payload) {
        page.children.push(
          createQuestionNodeByType(order, action.payload.questionType)
        )
      } else if ('kind' in action.payload) {
        switch (action.payload.kind) {
          case NodeKind.GROUP:
            page.children.push(createGroupNode(order))
            break
          case NodeKind.INFO:
            page.children.push(createInfoNode(order))
            break
          case NodeKind.DIVIDER:
            page.children.push(createDividerNode(order))
            break
          default:
            page.children.push(createQuestionNode(order))
        }
      } else {
        page.children.push(createQuestionNode(order))
      }
      reindexNodes(page.children)
      markDirty(state)
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
      if (
        node.kind === NodeKind.QUESTION &&
        patch.config !== undefined &&
        Object.keys(patch.config).length > 0
      ) {
        const qNode = node as QuestionNode
        qNode.config = { ...qNode.config, ...patch.config }
      }
      markDirty(state)
    },

    removeNode(state, action: PayloadAction<NodeId>) {
      if (!state.data.draft) return
      const nodeId = action.payload
      const removed = removeNodeFromPages(state.data.draft.pages, nodeId)
      if (removed && state.ui.selectedNodeId === nodeId) {
        state.ui.selectedNodeId = null
      }
      if (removed) markDirty(state)
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
  saveStart,
  saveSuccess,
  saveFailure,
  updateSurveyMeta,
  setSelection,
  addPage,
  addNode,
  updateNode,
  removeNode
} = surveyEditorSlice.actions
