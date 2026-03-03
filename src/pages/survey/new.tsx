import { CreateSurveyForm } from '@/features/surveys/components/create-survey-form.component'
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
      <div className="flex w-full flex-col items-center p-4">
        <CreateSurveyForm />
      </div>
    </>
  )
}

export default NewSurveyPage
