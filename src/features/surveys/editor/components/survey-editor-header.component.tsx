import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { routes } from '@/config/routes'
import {
  SaveStatus,
  selectDraft,
  selectIsDirty,
  selectLastSavedAt,
  selectSaveStatus
} from '@/features/surveys/editor/state'
import { useMinDurationValue } from '@/hooks'
import { cn } from '@/lib/utils'
import { formatSavedAt } from '@/shared/i18n/format'
import { useAppSelector } from '@/store/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftIcon, Loader2Icon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * Le libellé est relatif : sans re-rendu, « il y a 2 minutes » resterait affiché
 * indéfiniment. 15 s borne le décalage entre l'heure réelle et l'heure affichée,
 * la plus petite unité rendue étant la minute.
 */
const SAVED_LABEL_REFRESH_MS = 15 * 1000

/** Une sauvegarde dure souvent moins que ça : sans plancher, « Enregistrement… » clignote. */
const MIN_PHASE_DURATION_MS = 1000

/**
 * Phase affichée, distincte de `SaveStatus` : c'est elle qui sert de clé
 * d'animation. La date n'y figure pas, pour qu'un passage de « il y a 1 minute »
 * à « il y a 2 minutes » change le texte sans rejouer la transition.
 */
const SavePhase = {
  UNSAVED: 'unsaved',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error'
} as const

type SavePhase = (typeof SavePhase)[keyof typeof SavePhase]

const labelVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
}

interface SurveyEditHeaderComponentProps {
  className?: string
}

export default function SurveyEditorHeaderComponent({
  className
}: SurveyEditHeaderComponentProps) {
  const survey = useAppSelector(selectDraft)
  const isDirty = useAppSelector(selectIsDirty)
  const saveStatus = useAppSelector(selectSaveStatus)
  const lastSavedAt = useAppSelector(selectLastSavedAt)
  const tSave = useTranslations('surveys.edit.save')
  const formatter = useFormatter()

  const [, setRefreshTick] = useState(0)

  const currentPhase = ((): SavePhase => {
    if (saveStatus === SaveStatus.SAVING) return SavePhase.SAVING
    if (saveStatus === SaveStatus.ERROR) return SavePhase.ERROR
    if (isDirty) return SavePhase.UNSAVED
    return SavePhase.SAVED
  })()

  const phase = useMinDurationValue(currentPhase, MIN_PHASE_DURATION_MS)

  const shouldRefresh = phase === SavePhase.SAVED && lastSavedAt !== null

  // `lastSavedAt` est dans les dépendances pour que l'intervalle reparte de zéro
  // à chaque sauvegarde : sinon il garde la phase du cycle précédent et la
  // bascule « à l'instant » → « il y a 1 minute » peut traîner d'autant.
  useEffect(() => {
    if (!shouldRefresh) return

    const interval = setInterval(
      () => setRefreshTick(tick => tick + 1),
      SAVED_LABEL_REFRESH_MS
    )

    return () => clearInterval(interval)
  }, [shouldRefresh, lastSavedAt])

  if (!survey) return null

  const isSaving = phase === SavePhase.SAVING

  const statusLabel = (() => {
    if (phase === SavePhase.SAVING) return tSave('saving')
    if (phase === SavePhase.ERROR) return tSave('error')
    if (phase === SavePhase.UNSAVED) return tSave('unsaved')
    if (!lastSavedAt) return tSave('saved')

    const { value, kind } = formatSavedAt(lastSavedAt, formatter)
    switch (kind) {
      case 'now':
        return tSave('savedNow')
      case 'relative':
        return tSave('savedRelative', { date: value })
      case 'time':
        return tSave('savedAtTime', { date: value })
      default:
        return tSave('savedOnDate', { date: value })
    }
  })()

  return (
    <div
      className={cn(
        'bg-background relative z-20 flex w-full min-w-0 items-center justify-between gap-2 overflow-hidden border-t border-b py-2 pr-4 pl-2',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={routes.survey.overview.getHref(survey.shortId)}>
            <ArrowLeftIcon className="size-4" strokeWidth={1.5} />
          </Link>
        </Button>
        <Separator orientation="vertical" className="shrink-0" />
        <h1 className="ml-2 hidden min-w-0 truncate font-semibold md:block">
          {survey.title}
        </h1>
      </div>

      <div
        className="flex min-w-0 items-center justify-end overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={phase}
            variants={labelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className={cn(
              'flex min-w-0 items-center gap-2 text-sm',
              phase === SavePhase.ERROR
                ? 'text-destructive'
                : 'text-muted-foreground'
            )}
          >
            {isSaving && (
              <Loader2Icon
                className="size-4 shrink-0 animate-spin"
                strokeWidth={1.5}
              />
            )}
            <span className="min-w-0 truncate">{statusLabel}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
