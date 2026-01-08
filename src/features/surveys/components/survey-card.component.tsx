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
import { Survey, SurveyStatus } from '@/shared/types/surveys/survey.type'
import { useFormatter, useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface SurveyCardProps {
  survey: Survey
}

const statusVariants: Record<SurveyStatus, 'default' | 'secondary' | 'outline'> = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline'
}

export function SurveyCard({ survey }: SurveyCardProps) {
  const tStatus = useTranslations('surveys.status.survey')
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
    return tStatus(survey.status)
  }

  return (
    <Card
      className={cn(
        'relative',
        survey.status === SurveyStatus.PUBLISHED &&
        'bg-radial-[at_90%_10%] from-primary/15 dark:to-neutral-900 to-background border-primary/60 ring-primary/20',
        survey.status !== SurveyStatus.PUBLISHED && 'ring-muted-foreground/10',
        survey.status === SurveyStatus.ARCHIVED &&
          'before:absolute before:inset-0 before:bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgb(0_0_0/0.01)_8px,rgb(0_0_0/0.01)_16px)] dark:before:bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgb(255_255_255/0.01)_8px,rgb(255_255_255/0.01)_16px)] before:pointer-events-none before:rounded-xl',
        'shadow-none py-5 ring-0 cursor-pointer transition-all border hover:ring-4'
      )}
    >
      <CardHeader className={cn(getArchivedStyle(survey))}>
        <CardTitle>{survey.title}</CardTitle>
        <CardDescription>{survey.subtitle}</CardDescription>
        <CardAction>
          <Badge variant={statusVariants[survey.status]}>
            {getStatusLabel()}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardFooter className={cn("flex items-center justify-between text-xs text-muted-foreground", getArchivedStyle(survey))}>
        {getDateStatusLabel(survey, formatter, tDate)}
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
  survey: Survey,
  formatter: ReturnType<typeof useFormatter>,
  tDate: ReturnType<typeof useTranslations<'surveys.date'>>
): string | null {
  switch (survey.status) {
    case SurveyStatus.PUBLISHED:
      if (!survey.publishedAt) return null
      const { value: publishedValue, isRelative: publishedIsRelative } = formatDate(
        survey.publishedAt,
        formatter
      )
      const publishedKey = publishedIsRelative ? 'publishedAtRelative' : 'publishedAt'
      return tDate(publishedKey, { date: publishedValue })
    case SurveyStatus.ARCHIVED:
      if (!survey.archivedAt) return null
      const { value: archivedValue, isRelative: archivedIsRelative } = formatDate(
        survey.archivedAt,
        formatter
      )
      const archivedKey = archivedIsRelative ? 'archivedAtRelative' : 'archivedAt'
      return tDate(archivedKey, { date: archivedValue })
    default:
      if (!survey.updatedAt) return null
      const { value: updatedValue, isRelative: updatedIsRelative } = formatDate(
        survey.updatedAt,
        formatter
      )
      const updatedKey = updatedIsRelative ? 'updatedAtRelative' : 'updatedAt'
      return tDate(updatedKey, { date: updatedValue })
  }
}

const getArchivedStyle = (survey: Survey) => {
  return survey.status === SurveyStatus.ARCHIVED ? 'opacity-40' : ''
}

