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
    isInitialized: false
  }
})

const surveyEditorSlice = createSlice({
  name: 'surveyEditor',
  initialState: getInitialState(),
  reducers: {
    initEditor(state) {
      state.status.isInitialized = true
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
export const { initEditor, resetEditor, setSelection } =
  surveyEditorSlice.actions
