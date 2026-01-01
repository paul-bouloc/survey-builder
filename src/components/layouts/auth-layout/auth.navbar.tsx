import SurveyLogo from '@/components/survey-logo.component'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export default function AuthNavbar() {
  return (
    <div className="flex w-full items-center justify-between p-4">
      <SurveyLogo />
      <ThemeToggle />
    </div>
  )
}
