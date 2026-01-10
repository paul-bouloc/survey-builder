import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'

const NewSurveyPage: NextPageWithLayout = () => {
  const t = useTranslations('routes.survey')

  return (
    <>
      <Head>
        <title>{t('new')}</title>
      </Head>
      <div>
        <h1>Create Survey</h1>
      </div>
    </>
  )
}

export default NewSurveyPage
