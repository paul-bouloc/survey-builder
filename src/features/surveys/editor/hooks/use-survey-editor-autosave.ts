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
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useCallback, useEffect, useRef, useState } from 'react'

const AUTOSAVE_DELAY_MS = 2000

/** Le PUT refuse un titre vide : tant qu'il l'est, on garde le draft dirty sans l'envoyer. */
function isDraftSavable(draft: SurveyDraft | null): draft is SurveyDraft {
  return draft !== null && draft.title.trim() !== ''
}

/**
 * Sauvegarde le draft complet en PUT, en différé après la dernière modification.
 *
 * Une seule requête est en vol à la fois : si le draft change pendant l'envoi,
 * la révision au retour ne correspond plus et un nouveau cycle est planifié.
 *
 * Il n'y a pas de sauvegarde manuelle : l'autosave est le seul chemin d'écriture.
 */
export function useSurveyEditorAutosave(shortId: string): void {
  const dispatch = useAppDispatch()
  const draft = useAppSelector(selectDraft)
  const revision = useAppSelector(selectDraftRevision)
  const isDirty = useAppSelector(selectIsDirty)
  const isEditable = useAppSelector(selectIsEditable)
  const { mutateAsync } = useUpdateSurvey(shortId)

  const isSavingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  /**
   * Incrémenté à la fin de chaque requête. Sans lui, un draft modifié pendant
   * l'envoi resterait dirty sans jamais replanifier de cycle : `revision` a déjà
   * changé pendant le vol, et l'effet ne se redéclencherait plus.
   */
  const [saveAttempt, setSaveAttempt] = useState(0)

  // Le timer lit le draft au moment où il se déclenche, pas celui capturé à sa création.
  const draftRef = useRef(draft)
  const revisionRef = useRef(revision)

  useEffect(() => {
    draftRef.current = draft
    revisionRef.current = revision
  }, [draft, revision])

  const canSave = isEditable && isDirty && isDraftSavable(draft)

  const save = useCallback(async () => {
    const currentDraft = draftRef.current
    if (isSavingRef.current || !isDraftSavable(currentDraft)) return

    const sentRevision = revisionRef.current
    isSavingRef.current = true
    dispatch(saveStart())

    try {
      await mutateAsync({
        title: currentDraft.title,
        subtitle: currentDraft.subtitle ?? null,
        description: currentDraft.description ?? null,
        pages: currentDraft.pages
      })
      dispatch(
        saveSuccess({
          revision: sentRevision,
          savedAt: new Date().toISOString()
        })
      )
      isSavingRef.current = false
      setSaveAttempt(current => current + 1)
    } catch (_error) {
      // L'échec laisse le draft dirty mais ne replanifie rien : sans cela, le
      // cycle retenterait indéfiniment toutes les 2 s. La prochaine modification
      // relance la sauvegarde. La reprise après échec relève de P1-5.
      isSavingRef.current = false
      dispatch(saveFailure())
    }
  }, [dispatch, mutateAsync])

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!canSave) return

    clearTimer()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      void save()
    }, AUTOSAVE_DELAY_MS)

    return clearTimer
    // `revision` est la dépendance qui relance le debounce à chaque frappe :
    // l'identité du draft ne change pas de façon fiable sous Immer.
  }, [canSave, revision, saveAttempt, save, clearTimer])

  useEffect(() => clearTimer, [clearTimer])
}
