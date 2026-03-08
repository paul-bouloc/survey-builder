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
        'bg-background relative z-20 flex w-full items-center justify-between border-t border-b py-2 pr-4 pl-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={routes.survey.overview.getHref(survey.shortId)}>
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <Separator orientation="vertical" />
        <h1 className="ml-2 max-w-72 truncate font-semibold">{survey.title}</h1>
      </div>
      {isDirty ? '' : ''}
      <Button disabled>Enregistrer</Button>
    </div>
  )
}
