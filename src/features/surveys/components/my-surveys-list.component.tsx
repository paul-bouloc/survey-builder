import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { routes } from '@/config/routes'
import { Survey } from '@/shared/types/surveys/survey.type'
import { FolderOpen } from 'lucide-react'
import Link from 'next/link'
import { SurveyCard } from './survey-card.component'

interface MySurveysListProps {
  surveys: Survey[]
}

export function MySurveysList({ surveys }: MySurveysListProps) {
  if (surveys.length === 0) {
    return (
      <Empty className='bg-neutral-50 dark:bg-neutral-900 border'>
        <EmptyHeader>
          <EmptyMedia variant="icon" className='bg-neutral-200 dark:bg-neutral-800'>
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>No survey created</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any survey yet. Get started by creating
            your first survey.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Link href={routes.survey.new.getHref()}>
              <Button>Create Survey 🔥</Button>
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {surveys.map(survey => (
        <SurveyCard key={survey._id} survey={survey} />
      ))}
    </div>
  )
}

