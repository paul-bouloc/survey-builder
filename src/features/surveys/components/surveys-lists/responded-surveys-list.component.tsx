import { IllustrativeIcon } from '@/components/icons/illustrative-icons/illustrative-icon'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import { useTranslations } from 'next-intl'
import { RespondedSurveyCard } from './responded-survey-card.component'

interface RespondedSurveysListProps {
  surveys: Survey[]
  responses: SurveyResponse[]
}

export function RespondedSurveysList({
  surveys,
  responses
}: RespondedSurveysListProps) {
  const t = useTranslations('surveys.list.respondedSurveys.empty')

  const responseMap = new Map(responses.map(response => [response.surveyId, response]))

  const surveysWithResponses = surveys.filter(survey =>
    responseMap.has(survey._id)
  )

  if (surveysWithResponses.length === 0) {
    return (
      <Empty className='bg-neutral-100 dark:bg-neutral-900 border'>
        <EmptyHeader>
          <IllustrativeIcon name="search" />
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>
            {t('description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button variant="outline">{t('startButton')}</Button>
          </div>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {surveysWithResponses.map(survey => {
        const response = responseMap.get(survey._id)!
        return (
          <RespondedSurveyCard key={survey._id} survey={survey} response={response} />
        )
      })}
    </div>
  )
}

