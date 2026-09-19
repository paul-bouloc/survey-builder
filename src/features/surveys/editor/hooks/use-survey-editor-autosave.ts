import { useUpdateSurvey } from '@/features/surveys/common/api/surveys.queries'
import {
  saveFailure,
  saveStart,
  saveSuccess,
  selectDraft,
  selectDraftRevision,
  selectIsDirty,
  selectIsEditable
} from '@/features/surveys/editor/state'
import type { SurveyDraft } from '@/features/surveys/editor/state'
import { isRetriableApiError } from '@/lib/api-error'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'

const AUTOSAVE_DELAY_MS = 2000
const MAX_RETRIES = 5
const RETRY_BASE_DELAY_MS = 1000

function getRetryDelayMs(attempt: number): number {
  const base = RETRY_BASE_DELAY_MS * 2 ** attempt
  return base + Math.random() * (base * 0.2)
}

function isDraftSavable(draft: SurveyDraft | null): draft is SurveyDraft {
  return draft !== null && draft.title.trim() !== ''
}

export function useSurveyEditorAutosave(shortId: string): void {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectDraft)
  const revision = useAppSelector(selectDraftRevision)
  const isDirty = useAppSelector(selectIsDirty)
  const isEditable = useAppSelector(selectIsEditable)
  const { mutateAsync } = useUpdateSurvey(shortId)

  const isSavingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryAttemptRef = useRef(0)
  const generationRef = useRef(0)
  const saveRef = useRef<(() => Promise<void>) | null>(null)
  const [saveAttempt, setSaveAttempt] = useState(0)

  const draftRef = useRef(draft)
  const revisionRef = useRef(revision)

  useEffect(() => {
    draftRef.current = draft
    revisionRef.current = revision
  }, [draft, revision])

  const canSave = isEditable && isDirty && isDraftSavable(draft)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const save = useCallback(async () => {
    const currentDraft = draftRef.current
    if (isSavingRef.current || !isDraftSavable(currentDraft)) return

    const sentRevision = revisionRef.current
    const sentGeneration = generationRef.current
    isSavingRef.current = true
    dispatch(saveStart())

    try {
      await mutateAsync({
        title: currentDraft.title,
        subtitle: currentDraft.subtitle ?? null,
        description: currentDraft.description ?? null,
        pages: currentDraft.pages
      })
      isSavingRef.current = false
      if (sentGeneration !== generationRef.current) return

      dispatch(
        saveSuccess({
          revision: sentRevision,
          savedAt: new Date().toISOString()
        })
      )
      retryAttemptRef.current = 0
      setSaveAttempt(current => current + 1)
    } catch (error) {
      isSavingRef.current = false
      if (sentGeneration !== generationRef.current) return

      const attempt = retryAttemptRef.current
      const canRetry = isRetriableApiError(error) && attempt < MAX_RETRIES

      if (!canRetry) {
        retryAttemptRef.current = 0
        dispatch(saveFailure())
        return
      }

      retryAttemptRef.current = attempt + 1
      clearTimer()
      timerRef.current = setTimeout(() => {
        timerRef.current = null
        void saveRef.current?.()
      }, getRetryDelayMs(attempt))
    }
  }, [dispatch, mutateAsync, clearTimer])

  useEffect(() => {
    saveRef.current = save
  }, [save])

  useEffect(() => {
    retryAttemptRef.current = 0
  }, [revision])

  useEffect(() => {
    if (!canSave) return

    clearTimer()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      void save()
    }, AUTOSAVE_DELAY_MS)

    return clearTimer
  }, [canSave, revision, saveAttempt, save, clearTimer])

  useEffect(() => {
    return () => {
      clearTimer()
      isSavingRef.current = false
      retryAttemptRef.current = 0
      generationRef.current += 1
    }
  }, [clearTimer, shortId])
}
