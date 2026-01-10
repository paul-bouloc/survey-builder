import SurveyLayout from '@/components/layouts/survey-layout/survey.layout'
import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'

const RunSurveyDonePage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.run')

  return (
    <>
      <Head>
        <title>{t('done')}</title>
      </Head>
      <div>
        <h1>Survey Completed {surveyShortId}</h1>
      </div>
    </>
  )
}

RunSurveyDonePage.getLayout = function getLayout(page: ReactElement) {
  return <SurveyLayout>{page}</SurveyLayout>
}

export default RunSurveyDonePage
