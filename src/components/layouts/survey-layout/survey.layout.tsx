import SurveyNavbar from '@/components/layouts/survey-layout/survey.navbar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SurveyLayoutProps {
  children: React.ReactNode
}

export default function SurveyLayout({ children }: SurveyLayoutProps) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center">
      <SurveyNavbar />
      <main className="relative flex min-h-0 w-full flex-1 overflow-hidden">
        <div
          className={cn(
            'pointer-events-none absolute top-0 right-0 left-0 z-10 h-10'
          )}
          style={{
            background: `linear-gradient(to bottom, var(--background), transparent)`
          }}
        />
        <ScrollArea className="h-full w-full">
          <div className="py-10">{children}</div>
        </ScrollArea>
      </main>
    </div>
  )
}
