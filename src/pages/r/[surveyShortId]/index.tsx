import SurveyLayout from '@/components/layouts/survey-layout/survey.layout'
import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

const RunSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.run')

  return (
    <>
      <Head>
        <title>{t('page')}</title>
      </Head>
      <div>
        <h1>Run Survey {surveyShortId}</h1>
      </div>
    </>
  )
}

RunSurveyPage.getLayout = function getLayout(page: ReactElement) {
  return <SurveyLayout>{page}</SurveyLayout>
}

export default RunSurveyPage
