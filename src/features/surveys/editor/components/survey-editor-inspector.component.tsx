import {
  Dialog,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog'
import { useIsMobile } from '@/hooks'
import { cn } from '@/lib/utils'

interface SurveyEditInspectorComponentProps {
  className?: string
}

export default function SurveyEditorInspectorComponent({
  className
}: SurveyEditInspectorComponentProps) {
  return (
    <InspectorWrapper className={className}>
      <h1>Inspector</h1>
    </InspectorWrapper>
  )
}

function InspectorWrapper({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Dialog>
        <DialogContent className="h-[calc(100vh-32px)] w-full max-w-[calc(100vw-32px)] overflow-y-auto sm:max-w-md">
          <DialogDescription className="sr-only">
            Panneau d&apos;édition des propriétés de l&apos;élément sélectionné.
          </DialogDescription>
          {children}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div
      className={cn(
        'bg-background min-h-0 max-w-72 min-w-0 flex-1 flex-col border-l',
        className
      )}
    >
      {children}
    </div>
  )
}
