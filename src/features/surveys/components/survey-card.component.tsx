import Badge from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Survey, SurveyStatus } from '@/shared/types/surveys/survey.type'

interface SurveyCardProps {
  survey: Survey
}

const statusLabels: Record<SurveyStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived'
}

const statusVariants: Record<SurveyStatus, 'default' | 'secondary' | 'outline'> = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline'
}

export function SurveyCard({ survey }: SurveyCardProps) {
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
          <Badge variant={statusVariants[survey.status]}>
            {statusLabels[survey.status]}
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
          <span>
            {survey.responseCount} response{survey.responseCount !== 1 ? 's' : ''}
          </span>
          {survey.publishedAt && (
            <span>
              Published on{' '}
              {new Date(survey.publishedAt).toLocaleDateString('en-US', {
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

