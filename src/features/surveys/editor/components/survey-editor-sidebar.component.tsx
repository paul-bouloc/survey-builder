import { cn } from '@/lib/utils'

interface SurveyEditSidebarComponentProps {
  className?: string
}

export default function SurveyEditorSidebarComponent({
  className
}: SurveyEditSidebarComponentProps) {
  return (
    <div
      className={cn(
        'bg-background relative hidden w-full flex-1 border-r md:max-w-72 xl:flex',
        className
      )}
    >
      Sidebar
    </div>
  )
}
