import { Button } from '@/components/ui/button'
import { routes } from '@/config/routes'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys.contract'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface SurveyOverviewHeaderProps {
  survey: SurveyOverviewResponse
}

export function SurveyOverviewHeader({ survey }: SurveyOverviewHeaderProps) {
  const tStatus = useTranslations('surveys.status.survey')
  const tOverview = useTranslations('surveys.overview')

  const isDraft = survey.status === SurveyStatus.DRAFT
  const isArchived = survey.status === SurveyStatus.ARCHIVED

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <h1 className="text-3xl font-semibold wrap-break-word">
          {survey.title}
        </h1>
        {survey.subtitle && (
          <p className="text-muted-foreground text-lg wrap-break-word">
            {survey.subtitle}
          </p>
        )}
        {survey.description && (
          <p className="text-muted-foreground text-sm wrap-break-word">
            {survey.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 md:ml-4 md:shrink-0">
        <Button variant="ghost" size="sm" disabled>
          {tStatus(survey.status)}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={routes.survey.preview.getHref(survey.shortId)}>
            {tOverview('actions.preview')}
          </Link>
        </Button>
        {!isArchived && (
          <Button variant="outline" size="sm" asChild>
            <Link href={routes.survey.edit.getHref(survey.shortId)}>
              {tOverview('actions.edit')}
            </Link>
          </Button>
        )}
        {isDraft ? (
          <Button
            variant="default"
            size="sm"
            disabled
            onClick={() => {
              // TODO: Implémenter la publication
            }}
          >
            {tOverview('actions.publish')}
          </Button>
        ) : isArchived ? (
          <Button
            variant="default"
            size="sm"
            disabled
            onClick={() => {
              // TODO: Implémenter la republication
            }}
          >
            {tOverview('actions.republish')}
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            disabled
            onClick={() => {
              // TODO: Implémenter le partage
            }}
          >
            {tOverview('actions.share')}
          </Button>
        )}
      </div>
    </div>
  )
}
