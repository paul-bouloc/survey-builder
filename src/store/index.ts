import { surveyEditorReducer } from '@/features/surveys/editor/state'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    surveyEditor: surveyEditorReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
