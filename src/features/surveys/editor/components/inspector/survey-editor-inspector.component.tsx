import { IllustrativeIcon } from '@/components/icons/illustrative-icons/illustrative-icon'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import {
  selectSelectedItem,
  setSelection,
  updateNode
} from '@/features/surveys/editor/state'
import { useIsMobile } from '@/hooks'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { GitBranch, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback } from 'react'
import { SurveyEditorNodeKindBadge } from '../nodes/survey-editor-node-kind-badge.component'
import { NodeLogicPanel } from './node-logic-panel.component'
import { NodeSettingsRouter } from './node-settings-router.component'

interface SurveyEditInspectorComponentProps {
  className?: string
}

export default function SurveyEditorInspectorComponent({
  className
}: SurveyEditInspectorComponentProps) {
  const selectedNode = useAppSelector(selectSelectedItem)
  const dispatch = useAppDispatch()
  const t = useTranslations('surveys.edit')

  const handlePatch = useCallback(
    (patch: SurveyItemPatch) => {
      if (!selectedNode) return
      dispatch(updateNode({ nodeId: selectedNode.id, patch }))
    },
    [dispatch, selectedNode]
  )

  const hasSelection = !!selectedNode
  const isMobile = useIsMobile()

  const handleCloseInspector = useCallback(() => {
    dispatch(setSelection(null))
  }, [dispatch])

  const content = !selectedNode ? (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
      <IllustrativeIcon name="tools" />
      <p className="text-muted-foreground px-4 py-6 text-center text-sm">
        {t('inspector.noSelection')}
      </p>
    </div>
  ) : (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <SurveyEditorNodeKindBadge node={selectedNode} className="px-4 pt-4" />

      <Tabs
        defaultValue="settings"
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <TabsList className="dark:bg-muted/25 mx-4 w-[calc(100%-32px)]">
          <TabsTrigger value="settings">
            <Settings strokeWidth={1.5} /> Paramètres
          </TabsTrigger>
          <TabsTrigger value="logic">
            <GitBranch strokeWidth={1.5} /> Logique
          </TabsTrigger>
        </TabsList>
        <Separator className="mt-2" />
        <div className="h-0 min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <TabsContent value="settings" className="p-4">
              <NodeSettingsRouter node={selectedNode} onPatch={handlePatch} />
            </TabsContent>
            <TabsContent value="logic" className="p-4">
              <NodeLogicPanel node={selectedNode} />
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer
        open={hasSelection}
        onOpenChange={open => !open && handleCloseInspector()}
        direction="bottom"
      >
        <DrawerContent className="flex h-full max-h-[90vh] flex-col overflow-hidden">
          <DrawerHeader className="shrink-0 border-b">
            <DrawerTitle>{t('inspector.title')}</DrawerTitle>
            <DrawerDescription className="sr-only">
              {t('inspector.description')}
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {content}
          </div>
          <DrawerFooter className="shrink-0 border-t">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full!">
                {t('inspector.close')}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <div
      className={cn(
        'bg-background flex min-h-0 max-w-72 min-w-0 flex-1 flex-col border-l',
        className
      )}
    >
      {content}
    </div>
  )
}
