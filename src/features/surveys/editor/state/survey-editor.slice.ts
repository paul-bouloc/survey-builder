import type { Survey } from '@/shared/types/surveys/survey.type'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SurveyEditorState, SurveyMetaPatch } from './survey-editor.types'

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
    setSelection(
      state,
      action: {
        payload: {
          nodeId?: SurveyEditorState['ui']['selectedNodeId']
        }
      }
    ) {
      const { nodeId } = action.payload
      if (nodeId !== undefined) state.ui.selectedNodeId = nodeId
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
  setSelection
} = surveyEditorSlice.actions
