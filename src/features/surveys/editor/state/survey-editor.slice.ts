import type { Survey } from '@/shared/types/surveys/survey.type'
import { createSlice } from '@reduxjs/toolkit'
import type { SurveyEditorState } from './survey-editor.types'

const getInitialState = (): SurveyEditorState => ({
  data: {
    survey: null
  },
  ui: {
    selectedNodeId: null
  },
  status: {
    phase: 'idle'
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
  setSelection
} = surveyEditorSlice.actions
