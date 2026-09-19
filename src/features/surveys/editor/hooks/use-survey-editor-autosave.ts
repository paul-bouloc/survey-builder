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

/**
 * Réessais après l'échec initial, sur erreur transitoire uniquement : 1 s, 2 s,
 * 4 s, 8 s, 16 s — une trentaine de secondes en tout. Au-delà, la panne n'a plus
 * rien de passager et continuer masquerait le problème sans jamais le signaler.
 */
const MAX_RETRIES = 5
const RETRY_BASE_DELAY_MS = 1000

/**
 * Le jitter évite que plusieurs onglets ouverts sur le même questionnaire ne
 * rejouent leurs tentatives en cadence, et retombent ensemble sur un serveur
 * qui se relève.
 */
function getRetryDelayMs(attempt: number): number {
  const base = RETRY_BASE_DELAY_MS * 2 ** attempt
  return base + Math.random() * (base * 0.2)
}

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
   * Tentatives consécutives ayant échoué pour le cycle en cours. Remis à zéro
   * par un succès et par toute nouvelle modification : une frappe pendant la
   * séquence repart d'un délai court plutôt que d'hériter du dernier palier.
   */
  const retryAttemptRef = useRef(0)
  /**
   * Identifie le cycle de vie courant du hook. Incrémentée à chaque changement
   * de questionnaire : une requête partie pour le questionnaire précédent
   * revient avec une génération périmée, et n'a alors plus le droit de toucher
   * au statut — sinon elle daterait comme « enregistré » un brouillon qui ne
   * l'est pas.
   */
  const generationRef = useRef(0)
  /**
   * Dernière version de `save`. Le retry se replanifie à travers elle : une
   * fonction ne peut pas figurer dans ses propres dépendances.
   */
  const saveRef = useRef<(() => Promise<void>) | null>(null)
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
      // Le questionnaire a changé pendant le vol : ce succès concerne le
      // précédent et ne dit rien du brouillon actuellement ouvert.
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

      // `attempt` est le nombre de réessais déjà consommés : 0 au premier échec.
      const attempt = retryAttemptRef.current
      const canRetry = isRetriableApiError(error) && attempt < MAX_RETRIES

      if (!canRetry) {
        // Échec définitif (4xx, ou erreur qui n'est pas de transport) ou
        // réessais épuisés : le draft reste dirty, mais plus rien n'est
        // planifié — sans quoi le cycle tournerait sans fin. La prochaine
        // modification repart d'un compteur neuf.
        retryAttemptRef.current = 0
        dispatch(saveFailure())
        return
      }

      // Le statut reste `saving` : une sauvegarde est bien en cours, et
      // l'utilisateur n'a de toute façon aucune action à sa disposition.
      // `error` n'apparaît qu'une fois les tentatives épuisées.
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

  // Une modification annule la séquence de réessais en cours : le contenu à
  // envoyer a changé, et le nouveau cycle repart du délai le plus court.
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
    // `revision` est la dépendance qui relance le debounce à chaque frappe :
    // l'identité du draft ne change pas de façon fiable sous Immer.
  }, [canSave, revision, saveAttempt, save, clearTimer])

  /**
   * Remet le cycle à zéro au démontage et à chaque changement de questionnaire.
   *
   * `isSavingRef` est le verrou « une seule requête en vol » : posé avant
   * l'`await`, il n'est levé qu'au règlement de la promesse. Or hors ligne,
   * React Query met la mutation **en pause** au lieu de la rejeter — elle ne se
   * règle qu'au retour du réseau. Sans cette remise à zéro, un départ pendant
   * cette pause laisserait le verrou fermé et le hook définitivement muet : une
   * ref survit à tout sauf à un remontage, et `shortId` change sans remonter le
   * composant.
   */
  useEffect(() => {
    return () => {
      clearTimer()
      isSavingRef.current = false
      retryAttemptRef.current = 0
      generationRef.current += 1
    }
  }, [clearTimer, shortId])
}
