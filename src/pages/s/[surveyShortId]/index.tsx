import { useSurvey } from '@/features/surveys/api/surveys.queries'
import { NextPageWithLayout } from '@/pages/_app'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'

const SurveyOverviewPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.survey')
  const tCommon = useTranslations('common')
  const tSurveys = useTranslations('surveys')

  const shortId = typeof surveyShortId === 'string' ? surveyShortId : ''
  const { data: survey, isLoading, error } = useSurvey(shortId)

  return (
    <>
      <Head>
        <title>{survey ? survey.title : t('overview')}</title>
      </Head>
      <div className="flex w-full flex-col items-center p-4">
        <div className="w-full max-w-md">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                {tCommon('loading')}...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-destructive text-sm">
                {tSurveys('overview.error.loadError')}
              </p>
            </div>
          ) : survey ? (
            <h1 className="mb-2 text-3xl font-semibold">{survey.title}</h1>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default SurveyOverviewPage
