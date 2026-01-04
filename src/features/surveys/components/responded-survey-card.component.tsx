import Badge from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ResponseStatus, SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'

interface RespondedSurveyCardProps {
  survey: Survey
  response: SurveyResponse
}

const responseStatusLabels: Record<ResponseStatus, string> = {
  in_progress: 'In Progress',
  completed: 'Completed'
}

const responseStatusVariants: Record<ResponseStatus, 'default' | 'secondary'> = {
  in_progress: 'secondary',
  completed: 'default'
}

export function RespondedSurveyCard({ survey, response }: RespondedSurveyCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <CardTitle>{survey.title}</CardTitle>
            {survey.subtitle && (
              <CardDescription>{survey.subtitle}</CardDescription>
            )}
          </div>
          <Badge variant={responseStatusVariants[response.status]}>
            {responseStatusLabels[response.status]}
          </Badge>
        </div>
      </CardHeader>
      {survey.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{survey.description}</p>
        </CardContent>
      )}
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {response.completedAt && (
            <span>
              Completed on{' '}
              {new Date(response.completedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          )}
          {!response.completedAt && response.updatedAt && (
            <span>
              Last updated on{' '}
              {new Date(response.updatedAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          )}
        </div>
        <span className="font-mono text-xs">{survey.shortId}</span>
      </CardFooter>
    </Card>
  )
}

