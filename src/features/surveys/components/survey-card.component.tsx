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
import { Survey, SurveyStatus } from '@/shared/types/surveys/survey.type'
import dayjs from 'dayjs'
import { toast } from 'sonner'

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
            {statusLabels[survey.status]}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardFooter className={cn("flex items-center justify-between text-xs text-muted-foreground", getArchivedStyle(survey))}>
        {getDateStatusLabel(survey)}
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

const getDateStatusLabel = (survey: Survey) => {
  switch (survey.status) {
    case SurveyStatus.PUBLISHED:
      return `Published on ${dayjs(survey.publishedAt).format('MMMM D, YYYY')}`
    case SurveyStatus.ARCHIVED:
      return `Archived on ${dayjs(survey.archivedAt).format('MMMM D, YYYY')}`
    default:
      return `Last updated on ${dayjs(survey.updatedAt).format('MMMM D, YYYY')}`
  }
}

const getArchivedStyle = (survey: Survey) => {
  return survey.status === SurveyStatus.ARCHIVED ? 'opacity-40' : ''
}

