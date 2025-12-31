import { cn } from '@/lib/utils'
import { Bird } from 'lucide-react'

interface SurveyLogoProps {
  className?: string
}

export default function SurveyLogo({ className }: SurveyLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
        <Bird className="size-6" />
      </div>
      <span className="text-secondary-foreground text-lg font-bold">
        Survey<span className="text-primary">Builder</span>
      </span>
    </div>
  )
}
