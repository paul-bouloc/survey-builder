import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { routes } from '@/config/routes'
import { selectIsDirty, selectSurvey } from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/store/hooks'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

interface SurveyEditHeaderComponentProps {
  className?: string
}

export default function SurveyEditorHeaderComponent({
  className
}: SurveyEditHeaderComponentProps) {
  const survey = useAppSelector(selectSurvey)
  const isDirty = useAppSelector(selectIsDirty)

  if (!survey) return null

  return (
    <div
      className={cn(
        'bg-background relative z-20 flex w-full min-w-0 items-center justify-between gap-2 overflow-hidden border-t border-b py-2 pr-4 pl-2',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={routes.survey.overview.getHref(survey.shortId)}>
            <ArrowLeftIcon className="size-4" strokeWidth={1.5} />
          </Link>
        </Button>
        <Separator orientation="vertical" className="shrink-0" />
        <h1 className="ml-2 hidden min-w-0 truncate font-semibold md:block">
          {survey.title}
        </h1>
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2">
        <span className="text-muted-foreground min-w-0 truncate text-sm">
          {isDirty ? 'Changements non enregistrés' : 'Enregistré'}
        </span>
        <Button disabled className="shrink-0">
          Enregistrer
        </Button>
      </div>
    </div>
  )
}
