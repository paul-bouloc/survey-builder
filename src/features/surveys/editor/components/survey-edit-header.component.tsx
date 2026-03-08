import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SurveyEditHeaderComponentProps {
  className?: string
}

export default function SurveyEditHeaderComponent({
  className
}: SurveyEditHeaderComponentProps) {
  return (
    <div
      className={cn(
        'bg-background relative z-20 flex w-full items-center justify-between border-b p-4 pt-0',
        className
      )}
    >
      SurveyEditHeaderComponent <Button disabled>Enregistrer</Button>
    </div>
  )
}
