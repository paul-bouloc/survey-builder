import { AxiosError } from 'axios'
import { useTranslations } from 'next-intl'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { IllustrativeIcon } from '@/components/icons/illustrative-icons/illustrative-icon'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { routes } from '@/config/routes'
import { useSurveyOverview } from '@/features/surveys/common/api/surveys.queries'
import { SurveyOverviewFormLink } from '@/features/surveys/overview/components/survey-overview-form-link.component'
import { SurveyOverviewHeader } from '@/features/surveys/overview/components/survey-overview-header.component'
import { SurveyOverviewMetadata } from '@/features/surveys/overview/components/survey-overview-metadata.component'
import { SurveyOverviewQuickActions } from '@/features/surveys/overview/components/survey-overview-quick-actions.component'
import { SurveyOverviewStats } from '@/features/surveys/overview/components/survey-overview-stats.component'
import { SurveyOverviewWeeklyChart } from '@/features/surveys/overview/components/survey-overview-weekly-chart.component'
import { extractApiError } from '@/lib/api-error'
import { NextPageWithLayout } from '@/pages/_app'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'

function isSurveyNotFoundError(error: unknown): boolean {
  if (!error) {
    return false
  }

  return (
    (error as AxiosError)?.response?.status === 404 ||
    extractApiError(error)?.code === 'not_found'
  )
}

const SurveyOverviewPage: NextPageWithLayout = () => {
  const router = useRouter()
  const t = useTranslations('routes.survey')
  const tCommon = useTranslations('common')
  const tSurveys = useTranslations('surveys')

  const shortId =
    typeof router.query.surveyShortId === 'string'
      ? router.query.surveyShortId
      : ''

  const { data: survey, isLoading, error } = useSurveyOverview(shortId)

  const isNotFound = isSurveyNotFoundError(error)
  const pageTitle = survey?.title ?? t('overview')

  useEffect(() => {
    if (isNotFound) {
      router.replace('/404')
    }
  }, [isNotFound, router])

  if (!shortId || isLoading || isNotFound) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>

        <div className="flex w-full flex-col items-center p-4">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground text-sm">
                {tCommon('loading')}...
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error || !survey) {
    return (
      <>
        <Head>
          <title>{pageTitle}</title>
        </Head>

        <div className="flex w-full flex-col items-center p-4">
          <div className="w-full max-w-6xl">
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
          </div>
        </div>
      </>
    )
  }

  const shouldShowFormLink = survey.status === SurveyStatus.PUBLISHED

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div className="flex w-full flex-col items-center p-4">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col gap-4">
            <SurveyOverviewHeader survey={survey} />

            <div className="mt-8 flex flex-col gap-4">
              <SurveyOverviewStats stats={survey.stats} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="col-span-1 min-w-0 md:col-span-2">
                  <SurveyOverviewWeeklyChart weeklyData={survey.weeklyData} />
                </div>

                <div className="col-span-1 flex min-w-0 flex-col gap-4 md:col-span-1">
                  <SurveyOverviewQuickActions survey={survey} />

                  {shouldShowFormLink ? (
                    <SurveyOverviewFormLink survey={survey} />
                  ) : null}

                  <SurveyOverviewMetadata survey={survey} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SurveyOverviewPage
