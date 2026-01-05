import SurveyLogo from '@/components/survey-logo.component'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { TooltipLinkButton } from '@/components/ui/tooltip-link-button'
import { routes } from '@/config/routes'
import { Home, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { UserMenu } from '../user-menu.component'

export default function RootNavbar() {
  const t = useTranslations('nav')

  return (
    <div className="flex w-full items-center justify-between p-4">
      <SurveyLogo />
      <div className="flex items-center gap-2">
        <LanguageSwitch />

        <TooltipLinkButton href={routes.home.getHref()} tooltip={t('home')}>
          <Home className="size-4" />
        </TooltipLinkButton>

        <TooltipLinkButton
          href={routes.survey.new.getHref()}
          tooltip={t('create')}
        >
          <Plus className="size-4" />
        </TooltipLinkButton>

        <UserMenu />
      </div>
    </div>
  )
}
