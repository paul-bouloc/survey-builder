import SurveyEditCanvasComponent from '@/features/surveys/components/survey-edit/canvas/survey-edit-canvas.component'
import SurveyEditHeaderComponent from '@/features/surveys/components/survey-edit/header/survey-edit-header.component'
import SurveyEditInspectorComponent from '@/features/surveys/components/survey-edit/inspector/survey-edit-inspector.component'
import SurveyEditSidebarComponent from '@/features/surveys/components/survey-edit/sidebar/survey-edit-sidebar.component'
import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'

const EditSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId: _surveyShortId } = router.query
  const t = useTranslations('routes.survey')

  return (
    <>
      <Head>
        <title>{t('edit')}</title>
      </Head>
      <div className="-my-10 flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden">
        <SurveyEditHeaderComponent />
        <div className="bg-muted dark:bg-background flex min-h-0 w-full flex-1">
          <SurveyEditSidebarComponent />
          <SurveyEditCanvasComponent />
          <SurveyEditInspectorComponent />
        </div>
      </div>
    </>
  )
}

export default EditSurveyPage
