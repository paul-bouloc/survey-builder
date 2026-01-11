import DatumLogo from '@/components/datum-logo.component'
import { UserMenu } from '@/components/layouts/user-menu.component'
import { TooltipLinkButton } from '@/components/ui/tooltip-link-button'
import { routes } from '@/config/routes'
import { Home } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SurveyNavbar() {
  const t = useTranslations('nav')

  return (
    <div className="flex w-full items-center justify-between p-4">
      <DatumLogo href={routes.home.getHref()} />
      <div className="flex items-center gap-2">
        <TooltipLinkButton href={routes.home.getHref()} tooltip={t('home')}>
          <Home className="size-4" />
        </TooltipLinkButton>

        <UserMenu />
      </div>
    </div>
  )
}
