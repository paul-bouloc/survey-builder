import { useSession } from '@/features/auth/api/auth.mutations'
import { useSurvey } from '@/features/surveys/common/api/surveys.queries'
import SurveyEditorCanvasComponent from '@/features/surveys/editor/components/survey-editor-canvas.component'
import SurveyEditorHeaderComponent from '@/features/surveys/editor/components/survey-editor-header.component'
import SurveyEditorInspectorComponent from '@/features/surveys/editor/components/survey-editor-inspector.component'
import SurveyEditorSidebarComponent from '@/features/surveys/editor/components/survey-editor-sidebar.component'
import { canEditSurvey } from '@/features/surveys/editor/lib/can-edit-survey'
import {
  loadError,
  loadForbidden,
  loadStart,
  loadSuccess,
  resetEditor,
  selectEditorPhase
} from '@/features/surveys/editor/state'
import { SurveyEditorErrorView } from '@/features/surveys/editor/views/survey-editor-error.view'
import { SurveyEditorForbiddenView } from '@/features/surveys/editor/views/survey-editor-forbidden.view'
import { SurveyEditorLoadingView } from '@/features/surveys/editor/views/survey-editor-loading.view'
import { NextPageWithLayout } from '@/pages/_app'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

function getShortIdFromQuery(
  query: Record<string, string | string[] | undefined>
): string {
  const raw = query.surveyShortId
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw) && raw[0]) return raw[0]
  return ''
}

const EditSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const shortId = getShortIdFromQuery(router.query)
  const dispatch = useAppDispatch()
  const phase = useAppSelector(selectEditorPhase)
  const t = useTranslations('routes.survey')

  const { data: survey, isLoading, isError } = useSurvey(shortId)
  const { data: session } = useSession()

  const lastSyncedShortId = useRef<string | null>(null)

  useEffect(() => {
    if (!shortId) {
      dispatch(resetEditor())
      lastSyncedShortId.current = null
      return
    }

    if (shortId !== lastSyncedShortId.current) {
      dispatch(resetEditor())
      lastSyncedShortId.current = shortId
    }

    if (isLoading) {
      dispatch(loadStart())
      return
    }

    if (isError) {
      dispatch(loadError())
      return
    }

    if (survey && session) {
      if (survey.shortId !== shortId) return

      if (canEditSurvey(survey, { userId: session.userId })) {
        dispatch(loadSuccess(survey))
      } else {
        dispatch(loadForbidden())
      }
    }
  }, [shortId, isLoading, isError, survey, session, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetEditor())
    }
  }, [dispatch])

  if (!shortId) {
    return (
      <>
        <Head>
          <title>{t('edit')}</title>
        </Head>
        <SurveyEditorLoadingView />
      </>
    )
  }

  if (phase === 'loading' || phase === 'idle') {
    return (
      <>
        <Head>
          <title>{t('edit')}</title>
        </Head>
        <div className="-my-10 flex h-[calc(100vh-64px)] w-full max-w-[100vw] min-w-0 flex-col overflow-hidden">
          <SurveyEditorLoadingView />
        </div>
      </>
    )
  }

  if (phase === 'error') {
    return (
      <>
        <Head>
          <title>{t('edit')}</title>
        </Head>
        <SurveyEditorErrorView />
      </>
    )
  }

  if (phase === 'forbidden') {
    return (
      <>
        <Head>
          <title>{t('edit')}</title>
        </Head>
        <SurveyEditorForbiddenView />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{t('edit')}</title>
      </Head>
      <div className="-my-10 flex h-[calc(100vh-64px)] w-full max-w-[100vw] min-w-0 flex-col overflow-hidden">
        <SurveyEditorHeaderComponent className="shrink-0" />
        <div className="bg-muted dark:bg-background flex min-h-0 w-full min-w-0 flex-1 overflow-hidden">
          <SurveyEditorSidebarComponent />
          <SurveyEditorCanvasComponent />
          <SurveyEditorInspectorComponent />
        </div>
      </div>
    </>
  )
}

export default EditSurveyPage
