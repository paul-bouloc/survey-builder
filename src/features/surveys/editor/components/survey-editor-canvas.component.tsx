import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { SurveyEditorMetaBlock } from './survey-editor-meta-block.component'

interface SurveyEditorCanvasComponentProps {
  className?: string
}

export default function SurveyEditorCanvasComponent({
  className
}: SurveyEditorCanvasComponentProps) {
  return (
    <ScrollArea
      className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}
    >
      <div className="mx-auto flex flex-col gap-4 px-4 py-4 md:max-w-[600px]">
        <SurveyEditorMetaBlock />
        <Separator />
        {/* Emplacement futur : pages et nodes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Pages</CardDescription>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
