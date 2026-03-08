import { IllustrativeIcon } from '@/components/icons/illustrative-icons/illustrative-icon'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle
} from '@/components/ui/empty'
import { routes } from '@/config/routes'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function SurveyEditorErrorView() {
  const t = useTranslations('surveys.edit.error')
  const tCommon = useTranslations('common.notFound')

  return (
    <Empty>
      <EmptyHeader>
        <IllustrativeIcon name="radioTower" />
        <EmptyTitle>{t('title')}</EmptyTitle>
        <EmptyDescription>{t('description')}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          {tCommon('goHomePrefix')}{' '}
          <Link href={routes.home.getHref()}>{tCommon('goHomeLink')}</Link>.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
