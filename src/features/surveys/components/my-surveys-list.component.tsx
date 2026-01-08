import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { routes } from '@/config/routes'
import { Survey } from '@/shared/types/surveys/survey.type'
import { FolderOpen } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { SurveyCard } from './survey-card.component'

interface MySurveysListProps {
  surveys: Survey[]
}

export function MySurveysList({ surveys }: MySurveysListProps) {
  const t = useTranslations('surveys.list.mySurveys.empty')

  if (surveys.length === 0) {
    return (
      <Empty className='bg-neutral-50 dark:bg-neutral-900 border'>
        <EmptyHeader>
          <EmptyMedia variant="icon" className='bg-neutral-200 dark:bg-neutral-800'>
            <FolderOpen />
          </EmptyMedia>
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>
            {t('description')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Link href={routes.survey.new.getHref()}>
              <Button>{t('createButton')}</Button>
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

