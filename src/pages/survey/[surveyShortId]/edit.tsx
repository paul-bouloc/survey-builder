import SurveyEditCanvasComponent from '@/features/surveys/editor/components/survey-edit-canvas.component'
import SurveyEditHeaderComponent from '@/features/surveys/editor/components/survey-edit-header.component'
import SurveyEditInspectorComponent from '@/features/surveys/editor/components/survey-edit-inspector.component'
import SurveyEditSidebarComponent from '@/features/surveys/editor/components/survey-edit-sidebar.component'
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
