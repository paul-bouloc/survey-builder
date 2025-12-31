import SurveyLogo from '@/components/survey-logo.component'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { TooltipLinkButton } from '@/components/ui/tooltip-link-button'
import { routes } from '@/config/routes'
import { Home, Plus } from 'lucide-react'

export default function RootNavbar() {
  return (
    <div className="flex w-full items-center justify-between p-4">
      <SurveyLogo />
      <div className="flex items-center gap-2">
        <TooltipLinkButton href={routes.home.getHref()} tooltip="Go to home">
          <Home className="size-4" />
        </TooltipLinkButton>

        <TooltipLinkButton
          href={routes.survey.new.getHref()}
          tooltip="Create a new survey"
        >
          <Plus className="size-4" />
        </TooltipLinkButton>

        <ThemeToggle />
      </div>
    </div>
  )
}
