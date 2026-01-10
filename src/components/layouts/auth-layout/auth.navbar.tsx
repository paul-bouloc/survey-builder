import SurveyLogo from '@/components/survey-logo.component'
import { LanguageSwitch } from '@/components/ui/language-switch'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function AuthNavbar() {
  return (
    <div className="flex w-full items-center justify-between p-4">
      <SurveyLogo />

      <div className="flex items-center gap-2">
        <LanguageSwitch />
        <ThemeToggle />
      </div>
    </div>
  )
}
