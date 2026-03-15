import Badge from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { routes } from '@/config/routes'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys/surveys.overview.schema'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'
import { ArchiveIcon, CheckCircleIcon, WrenchIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface SurveyOverviewHeaderProps {
  survey: SurveyOverviewResponse
}

type HeaderAction = {
  key: string
  label: string
  variant?: 'default' | 'outline' | 'ghost'
  href?: string
  disabled?: boolean
  onClick?: () => void
}

export function SurveyOverviewHeader({ survey }: SurveyOverviewHeaderProps) {
  const tStatus = useTranslations('surveys.status.survey')
  const tOverview = useTranslations('surveys.overview')

  const isDraft = survey.status === SurveyStatus.DRAFT
  const isArchived = survey.status === SurveyStatus.ARCHIVED
  const isPublished = survey.status === SurveyStatus.PUBLISHED

  const actions: HeaderAction[] = [
    {
      key: 'preview',
      label: tOverview('actions.preview'),
      variant: 'outline',
      href: routes.survey.preview.getHref(survey.shortId)
    }
  ]

  if (isDraft) {
    actions.push(
      {
        key: 'edit',
        label: tOverview('actions.edit'),
        variant: 'outline',
        href: routes.survey.edit.getHref(survey.shortId)
      },
      {
        key: 'publish',
        label: tOverview('actions.publish'),
        variant: 'default',
        disabled: true,
        onClick: () => {
          // TODO: Implémenter la publication
        }
      }
    )
  }

  if (isArchived) {
    actions.push({
      key: 'republish',
      label: tOverview('actions.republish'),
      variant: 'default',
      disabled: true,
      onClick: () => {
        // TODO: Implémenter la republication
      }
    })
  }

  if (isPublished) {
    actions.push({
      key: 'share',
      label: tOverview('actions.share'),
      variant: 'default',
      disabled: true,
      onClick: () => {
        // TODO: Implémenter le partage
      }
    })
  }

  const statusBadgeIcon: Record<SurveyStatus, React.ReactNode> = {
    [SurveyStatus.DRAFT]: (
      <WrenchIcon className="text-muted-foreground" strokeWidth={1.5} />
    ),
    [SurveyStatus.PUBLISHED]: (
      <CheckCircleIcon className="text-yellow-500" strokeWidth={1.5} />
    ),
    [SurveyStatus.ARCHIVED]: (
      <ArchiveIcon className="text-muted-foreground" strokeWidth={1.5} />
    )
  }

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
        <Badge variant="ghost">
          {statusBadgeIcon[survey.status]}
          {tStatus(survey.status)}
        </Badge>

        {actions.map(action => {
          if (action.href) {
            return (
              <Button
                key={action.key}
                variant={action.variant ?? 'default'}
                size="sm"
                asChild
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            )
          }

          return (
            <Button
              key={action.key}
              variant={action.variant ?? 'default'}
              size="sm"
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
