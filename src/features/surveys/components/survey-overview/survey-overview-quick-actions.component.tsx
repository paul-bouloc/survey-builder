import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { routes } from '@/config/routes'
import { cn } from '@/lib/utils'
import type { SurveyOverviewResponse } from '@/shared/api/contracts/surveys.contract'
import { BarChart3, Download, Edit, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface SurveyOverviewQuickActionsProps {
  survey: SurveyOverviewResponse
}

interface QuickAction {
  key: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export function SurveyOverviewQuickActions({
  survey
}: SurveyOverviewQuickActionsProps) {
  const tQuickActions = useTranslations('surveys.overview.quickActions')

  const actions: QuickAction[] = [
    {
      key: 'statistics',
      icon: BarChart3,
      href: routes.survey.analytics.getHref(survey.shortId)
    },
    {
      key: 'responses',
      icon: FileText,
      href: routes.survey.results.getHref(survey.shortId)
    },
    {
      key: 'edit',
      icon: Edit,
      href: routes.survey.edit.getHref(survey.shortId)
    },
    {
      key: 'export',
      icon: Download,
      onClick: () => {
        // TODO: Implémenter l'export
        console.log('Export')
      },
      disabled: true
    }
  ]

  return (
    <Card className="from-primary/15 to-background border-primary/60 ring-primary/20 border bg-radial-[at_90%_10%] p-2 shadow-none ring-4 dark:to-neutral-900">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-2">
          {actions.map(action => {
            const Icon = action.icon
            const content = (
              <div
                className={cn(
                  'group bg-card relative flex flex-col gap-2 rounded-lg border p-4 transition-all',
                  !action.disabled && 'hover:bg-muted/50 cursor-pointer',
                  action.disabled &&
                    'cursor-not-allowed opacity-40 before:pointer-events-none before:absolute before:inset-0 before:rounded-lg before:bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgb(0_0_0/0.01)_8px,rgb(0_0_0/0.01)_16px)] dark:before:bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgb(255_255_255/0.01)_8px,rgb(255_255_255/0.01)_16px)]'
                )}
                onClick={action.onClick}
              >
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">
                    {action.key === 'statistics' &&
                      tQuickActions('statistics.title')}
                    {action.key === 'responses' &&
                      tQuickActions('responses.title')}
                    {action.key === 'edit' && tQuickActions('edit.title')}
                    {action.key === 'export' && tQuickActions('export.title')}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {action.key === 'statistics' &&
                      tQuickActions('statistics.description')}
                    {action.key === 'responses' &&
                      tQuickActions('responses.description')}
                    {action.key === 'edit' && tQuickActions('edit.description')}
                    {action.key === 'export' &&
                      tQuickActions('export.description')}
                  </div>
                </div>
              </div>
            )

            if (action.disabled) {
              return (
                <Tooltip key={action.key}>
                  <TooltipTrigger asChild>
                    <div>{content}</div>
                  </TooltipTrigger>
                  <TooltipContent>{tQuickActions('comingSoon')}</TooltipContent>
                </Tooltip>
              )
            }

            if (action.href) {
              return (
                <Link key={action.key} href={action.href}>
                  {content}
                </Link>
              )
            }

            return <div key={action.key}>{content}</div>
          })}
        </div>
      </CardContent>
    </Card>
  )
}
