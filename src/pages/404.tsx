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

export default function NotFound() {
  const t = useTranslations('common.notFound')

  return (
    <Empty>
      <EmptyHeader>
        <IllustrativeIcon name="edvardMunch" />
        <EmptyTitle>{t('title')}</EmptyTitle>
        <EmptyDescription>
          {t('description')}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          {t('goHomePrefix')}{' '}
          <Link href={routes.home.getHref()}>{t('goHomeLink')}</Link>.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
