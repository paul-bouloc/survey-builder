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
import { formatDate } from '@/shared/i18n/format'
import { ResponseStatus, SurveyResponse } from '@/shared/types/surveys/survey-response.type'
import { Survey } from '@/shared/types/surveys/survey.type'
import { useFormatter, useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface RespondedSurveyCardProps {
  survey: Survey
  response: SurveyResponse
}

const responseStatusVariants: Record<ResponseStatus, 'default' | 'secondary'> = {
  in_progress: 'secondary',
  completed: 'default'
}

export function RespondedSurveyCard({ survey, response }: RespondedSurveyCardProps) {
  const tStatus = useTranslations('surveys.status.response')
  const tDate = useTranslations('surveys.date')
  const tCard = useTranslations('surveys.card')
  const formatter = useFormatter()

  const handleCopyShortId = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(survey.shortId)
      toast.success(tCard('toast.copySuccess'))
    } catch (error) {
      toast.error(tCard('toast.copyError'))
    }
  }

  const getStatusLabel = () => {
    return response.status === 'completed'
      ? tStatus('completed')
      : tStatus('inProgress')
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
            {getStatusLabel()}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        {getDateStatusLabel(response, formatter, tDate)}
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
          <TooltipContent>{tCard('tooltip.copyShortId')}</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

function getDateStatusLabel(
  response: SurveyResponse,
  formatter: ReturnType<typeof useFormatter>,
  tDate: ReturnType<typeof useTranslations<'surveys.date'>>
): string | null {
  if (response.completedAt) {
    const { value, isRelative } = formatDate(
      response.completedAt,
      formatter,
    )
    const key = isRelative ? 'completedAtRelative' : 'completedAt'
    return tDate(key, { date: value })
  }
  if (response.updatedAt) {
    const { value, isRelative } = formatDate(
      response.updatedAt,
      formatter,
    )
    const key = isRelative ? 'updatedAtRelative' : 'updatedAt'
    return tDate(key, { date: value })
  }
  return null
}
