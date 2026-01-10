import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'

const SurveyResultsPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.survey.results')

  return (
    <>
      <Head>
        <title>{t('page')}</title>
      </Head>
      <div>
        <h1>Survey Results {surveyShortId}</h1>
      </div>
    </>
  )
}

export default SurveyResultsPage
