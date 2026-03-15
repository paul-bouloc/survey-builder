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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { surveyNodeConfig } from '@/features/surveys/editor/config/survey-node.config'
import {
  selectPageContainingSelectedNode,
  selectSelectedNode,
  selectSelectedPage,
  setSelection,
  updateNode,
  updatePage
} from '@/features/surveys/editor/state'
import { useIsMobile } from '@/hooks'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { GitBranch, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, type ChangeEvent } from 'react'
import { SurveyEditorNodeKindBadge } from '../nodes/survey-editor-node-kind-badge.component'

interface SurveyEditInspectorComponentProps {
  className?: string
}

export default function SurveyEditorInspectorComponent({
  className
}: SurveyEditInspectorComponentProps) {
  const selectedPage = useAppSelector(selectSelectedPage)
  const selectedNode = useAppSelector(selectSelectedNode)
  const pageContainingNode = useAppSelector(selectPageContainingSelectedNode)
  const dispatch = useAppDispatch()
  const t = useTranslations('surveys.edit')
  const tForm = useTranslations('form.inputs')
  const tPages = useTranslations('surveys.edit.pages')

  const handleNodePatch = useCallback(
    (field: 'title' | 'subtitle' | 'description') =>
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!pageContainingNode || !selectedNode) return
        const { value } = e.target
        dispatch(
          updateNode({
            pageId: pageContainingNode.id,
            nodeId: selectedNode.id,
            patch: { [field]: value || null }
          })
        )
      },
    [dispatch, pageContainingNode, selectedNode]
  )

  const handlePagePatch = useCallback(
    (field: 'title' | 'subtitle' | 'description') =>
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!selectedPage) return
        const { value } = e.target
        dispatch(
          updatePage({
            pageId: selectedPage.id,
            patch: { [field]: value || null }
          })
        )
      },
    [dispatch, selectedPage]
  )

  const hasSelection = !!selectedPage || !!selectedNode
  const isMobile = useIsMobile()

  const handleCloseInspector = useCallback(() => {
    dispatch(setSelection(null))
  }, [dispatch])

  const content = (() => {
    if (selectedPage) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <span className="text-muted-foreground text-xs font-medium">
            {tPages('pageSettings')}
          </span>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector-page-title">{tForm('title.label')}</Label>
            <Input
              id="inspector-page-title"
              value={selectedPage.title ?? ''}
              maxLength={surveyNodeConfig.title.maxLength}
              spellCheck={false}
              onChange={handlePagePatch('title')}
              autoComplete="off"
            />
          </div>
        </div>
      )
    }

    if (selectedNode && pageContainingNode) {
      return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <SurveyEditorNodeKindBadge
            node={selectedNode}
            className="px-4 pt-4"
          />

          <Tabs
            defaultValue="settings"
            className="flex min-h-0 flex-1 flex-col gap-0"
          >
            <TabsList className="mx-4 w-[calc(100%-32px)]">
              <TabsTrigger value="settings">
                <Settings /> Paramètres
              </TabsTrigger>
              <TabsTrigger value="logic">
                <GitBranch /> Logique
              </TabsTrigger>
            </TabsList>
            <Separator className="mt-2" />
            <div className="h-0 min-h-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <TabsContent value="settings" className="p-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="inspector-node-title">
                      {tForm('title.label')}
                    </Label>
                    <Input
                      id="inspector-node-title"
                      value={selectedNode.title ?? ''}
                      maxLength={surveyNodeConfig.title.maxLength}
                      spellCheck={false}
                      onChange={handleNodePatch('title')}
                      autoComplete="off"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="logic" className="p-4">
                  Analytics
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      )
    }

    return (
      <p className="text-muted-foreground px-4 py-6 text-sm">
        {t('inspector.noSelection')}
      </p>
    )
  })()

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
