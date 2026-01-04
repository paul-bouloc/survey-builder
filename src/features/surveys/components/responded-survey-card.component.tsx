import Badge from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ResponseStatus, SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import dayjs from 'dayjs'
import { toast } from 'sonner'

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
  const handleCopyShortId = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(survey.shortId)
      toast.success('Short ID copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy Short ID')
    }
  }

  return (
    <Card className={cn(response.completedAt &&
      'bg-radial-[at_90%_10%] from-primary/15 dark:to-neutral-900 to-background border-primary/60 ring-primary/20',
      !response.completedAt && 'ring-muted-foreground/10', 'shadow-none py-5 ring-0 cursor-pointer transition-all border hover:ring-4')}>
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        <CardDescription>{survey.subtitle}</CardDescription>
        <CardAction>
          <Badge variant={responseStatusVariants[response.status]}>
            {responseStatusLabels[response.status]}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        {getDateStatusLabel(response)}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleCopyShortId}
              className="font-mono tracking-wide cursor-pointer hover:text-foreground transition-colors"
              type="button"
            >
              <span className="opacity-40">#</span>
              {survey.shortId}
            </button>
          </TooltipTrigger>
          <TooltipContent>Click to copy Short ID</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

const getDateStatusLabel = (response: SurveyResponse) => {
  if (response.completedAt) {
    return `Completed on ${dayjs(response.completedAt).format('MMMM D, YYYY')}`
  }
  if (response.updatedAt) {
    return `Last updated on ${dayjs(response.updatedAt).format('MMMM D, YYYY')}`
  }
  return null
}
