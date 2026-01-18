import { IllustrativeIcon } from '@/components/icons/illustrative-icons/illustrative-icon'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { routes } from '@/config/routes'
import { useSurveyOverview } from '@/features/surveys/api/surveys.queries'
import { SurveyOverviewHeader } from '@/features/surveys/components/survey-overview/survey-overview-header.component'
import { SurveyOverviewStats } from '@/features/surveys/components/survey-overview/survey-overview-stats.component'
import { SurveyOverviewWeeklyChart } from '@/features/surveys/components/survey-overview/survey-overview-weekly-chart.component'
import { extractApiError } from '@/lib/api-error'
import { NextPageWithLayout } from '@/pages/_app'
import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const SurveyOverviewPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { surveyShortId } = router.query
  const t = useTranslations('routes.survey')
  const tCommon = useTranslations('common')
  const tSurveys = useTranslations('surveys')

  const shortId = typeof surveyShortId === 'string' ? surveyShortId : ''
  const { data: survey, isLoading, error } = useSurveyOverview(shortId)

  useEffect(() => {
    if (error) {
      const is404 =
        (error as AxiosError)?.response?.status === 404 ||
        extractApiError(error)?.code === 'not_found'

      if (is404) {
        router.push('/404')
      }
    }
  }, [error, router])

  const is404 =
    error &&
    ((error as AxiosError)?.response?.status === 404 ||
      extractApiError(error)?.code === 'not_found')

  return (
    <>
      <Head>
        <title>{survey ? survey.title : t('overview')}</title>
      </Head>
      <div className="flex w-full flex-col items-center p-4">
        <div className="w-full max-w-6xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                {tCommon('loading')}...
              </p>
            </div>
          ) : is404 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                {tCommon('loading')}...
              </p>
            </div>
          ) : error ? (
            <Empty>
              <EmptyHeader>
                <IllustrativeIcon name="edvardMunch" />
                <EmptyTitle>{tSurveys('overview.error.title')}</EmptyTitle>
                <EmptyDescription>
                  {tSurveys('overview.error.description')}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => router.push(routes.home.getHref())}
                >
                  {tCommon('back')}
                </Button>
              </EmptyContent>
            </Empty>
          ) : survey ? (
            <div className="flex flex-col gap-4">
              <SurveyOverviewHeader survey={survey} />
              <SurveyOverviewStats stats={survey.stats} />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="col-span-1 min-w-0 md:col-span-2">
                  <SurveyOverviewWeeklyChart weeklyData={survey.weeklyData} />
                </div>
                <div className="col-span-1 min-w-0 md:col-span-1">
                  <Card />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default SurveyOverviewPage
