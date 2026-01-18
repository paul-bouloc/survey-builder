import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys.contract'
import { formatDate } from '@/shared/i18n/format'
import { Calendar, Clock, FileText, Layers } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'

interface SurveyOverviewMetadataProps {
  survey: SurveyOverviewResponse
}

interface MetadataItem {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

export function SurveyOverviewMetadata({
  survey
}: SurveyOverviewMetadataProps) {
  const tMetadata = useTranslations('surveys.overview.metadata')
  const formatter = useFormatter()

  const metadataItems: MetadataItem[] = []

  const { value: createdAtValue } = formatDate(survey.createdAt, formatter)
  metadataItems.push({
    icon: Calendar,
    label: tMetadata('createdAt'),
    value: createdAtValue
  })

  const { value: updatedAtValue } = formatDate(survey.updatedAt, formatter)
  metadataItems.push({
    icon: Clock,
    label: tMetadata('updatedAt'),
    value: updatedAtValue
  })

  if (survey.publishedAt) {
    const { value: publishedAtValue } = formatDate(
      survey.publishedAt,
      formatter
    )
    metadataItems.push({
      icon: Calendar,
      label: tMetadata('publishedAt'),
      value: publishedAtValue
    })
  }

  if (survey.archivedAt) {
    const { value: archivedAtValue } = formatDate(survey.archivedAt, formatter)
    metadataItems.push({
      icon: Calendar,
      label: tMetadata('archivedAt'),
      value: archivedAtValue
    })
  }

  metadataItems.push({
    icon: FileText,
    label: tMetadata('questions'),
    value: survey.questionCount.toString()
  })

  metadataItems.push({
    icon: Layers,
    label: tMetadata('pages'),
    value: survey.pageCount.toString()
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tMetadata('title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metadataItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-muted-foreground text-xs">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium">{item.value}</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
