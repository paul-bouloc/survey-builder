import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  addPage,
  selectEditorPages,
  setSelection
} from '@/features/surveys/editor/state'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { SurveyEditorMetaBlock } from './survey-editor-meta-block.component'
import { SurveyEditorPageBlock } from './survey-editor-page-block.component'

interface SurveyEditorCanvasComponentProps {
  className?: string
}

export default function SurveyEditorCanvasComponent({
  className
}: SurveyEditorCanvasComponentProps) {
  const pages = useAppSelector(selectEditorPages)
  const dispatch = useAppDispatch()
  const t = useTranslations('surveys.edit.pages')

  return (
    <ScrollArea
      className={cn('relative flex min-h-0 w-full flex-1 flex-col', className)}
    >
      <div
        className="min-h-[calc(100vh-128px)] w-full flex-1"
        role="presentation"
        onClick={() => dispatch(setSelection(null))}
      >
        <div className="mx-auto flex flex-col gap-4 px-4 py-4 md:max-w-[600px]">
          <SurveyEditorMetaBlock />

          <div className="flex flex-col gap-4 pb-8" data-canvas="pages">
            {pages.map((page, index) => (
              <SurveyEditorPageBlock key={page.id} page={page} index={index} />
            ))}

            <div className="mt-2 flex w-full items-center gap-3">
              <Separator className="flex-1" />
              <Button
                type="button"
                variant="outline"
                className="dark:hover:bg-muted/20! h-8.5 w-64! rounded-full border-dashed bg-transparent! shadow-none! hover:bg-neutral-200/30!"
                onClick={() => dispatch(addPage())}
              >
                <Plus />
                {t('addPage')}
              </Button>
              <Separator className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  )
}
