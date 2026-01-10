import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'

const AnswerSurveyPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes')

  return (
    <>
      <Head>
        <title>{t('answer')}</title>
      </Head>
      <div>
        <h1>Answer Survey {surveyShortId}</h1>
      </div>
    </>
  )
}

export default AnswerSurveyPage
