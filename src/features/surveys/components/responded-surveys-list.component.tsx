import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import { FolderOpen } from 'lucide-react'
import { RespondedSurveyCard } from './responded-survey-card.component'

interface RespondedSurveysListProps {
  surveys: Survey[]
  responses: SurveyResponse[]
}

export function RespondedSurveysList({
  surveys,
  responses
}: RespondedSurveysListProps) {
  // Créer un map pour associer rapidement les surveys à leurs réponses
  const surveyMap = new Map(surveys.map(survey => [survey._id, survey]))
  const responseMap = new Map(responses.map(response => [response.surveyId, response]))

  // Filtrer les surveys qui ont une réponse
  const surveysWithResponses = surveys.filter(survey =>
    responseMap.has(survey._id)
  )

  if (surveysWithResponses.length === 0) {
    return (
      (
        <Empty className='bg-neutral-50 dark:bg-neutral-900 border'>
          <EmptyHeader>
            <EmptyMedia variant="icon" className='bg-neutral-200 dark:bg-neutral-800'>
              <FolderOpen />
            </EmptyMedia>
            <EmptyTitle>No survey responded</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t responded to any survey yet. Respond to a survey to see it appear here!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button variant="outline">Start a survey 🔎</Button>
            </div>
          </EmptyContent>
        </Empty>
      )
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

