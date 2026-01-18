import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'

const PreviewSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.survey')

  return (
    <>
      <Head>
        <title>{t('preview')}</title>
      </Head>
      <div>
        <h1>Preview Survey {surveyShortId}</h1>
      </div>
    </>
  )
}

export default PreviewSurveyPage
