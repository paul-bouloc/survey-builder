import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'

const SurveyResultDetailPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId, responseShortId } = router.query
  const t = useTranslations('routes.survey.results')

  return (
    <>
      <Head>
        <title>{t('detail')}</title>
      </Head>
      <div>
        <h1>Survey Result Detail</h1>
        <p>Survey: {surveyShortId}</p>
        <p>Response: {responseShortId}</p>
      </div>
    </>
  )
}

export default SurveyResultDetailPage
