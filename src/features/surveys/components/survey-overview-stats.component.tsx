import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys.contract'
import { useTranslations } from 'next-intl'

interface SurveyOverviewStatsProps {
  stats: SurveyOverviewResponse['stats']
}

export function SurveyOverviewStats({ stats }: SurveyOverviewStatsProps) {
  const tOverview = useTranslations('surveys.overview.stats')

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {stats.totalResponses}
          </CardTitle>
          <CardDescription>{tOverview('totalResponses')}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {stats.completionRate}
            <span className="text-muted-foreground ml-1 text-sm">%</span>
          </CardTitle>
          <CardDescription>{tOverview('completionRate')}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            {stats.completedCount}
          </CardTitle>
          <CardDescription>{tOverview('completedResponses')}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
