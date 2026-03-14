import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
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
import { useTranslations } from 'next-intl'
import { useCallback, type ChangeEvent } from 'react'
import { SurveyEditorNodeKindBadge } from './nodes/survey-editor-node-kind-badge.component'

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

  const handleSkippableChange = useCallback(
    (checked: boolean | 'indeterminate') => {
      if (!selectedPage) return
      dispatch(
        updatePage({
          pageId: selectedPage.id,
          patch: { page: { skippable: checked === true } }
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
              placeholder={tPages('noTitle')}
              maxLength={surveyNodeConfig.title.maxLength}
              spellCheck={false}
              onChange={handlePagePatch('title')}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector-page-subtitle">
              {tForm('subtitle.label')}
            </Label>
            <Input
              id="inspector-page-subtitle"
              value={selectedPage.subtitle ?? ''}
              placeholder={tPages('noSubtitle')}
              maxLength={surveyNodeConfig.subtitle.maxLength}
              spellCheck={false}
              onChange={handlePagePatch('subtitle')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector-page-description">
              {tForm('description.label')}
            </Label>
            <Input
              id="inspector-page-description"
              value={selectedPage.description ?? ''}
              placeholder={tPages('noDescription')}
              maxLength={surveyNodeConfig.description.maxLength}
              spellCheck={false}
              onChange={handlePagePatch('description')}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="inspector-page-skippable"
              checked={selectedPage.page.skippable}
              onCheckedChange={handleSkippableChange}
            />
            <Label
              htmlFor="inspector-page-skippable"
              className="cursor-pointer text-sm font-normal"
            >
              {tPages('skippable')}
            </Label>
          </div>
        </div>
      )
    }

    if (selectedNode && pageContainingNode) {
      return (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Type
            </span>
            <SurveyEditorNodeKindBadge node={selectedNode} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector-node-title">{tForm('title.label')}</Label>
            <Input
              id="inspector-node-title"
              value={selectedNode.title ?? ''}
              placeholder={tForm('title.placeholder')}
              maxLength={surveyNodeConfig.title.maxLength}
              spellCheck={false}
              onChange={handleNodePatch('title')}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector-node-subtitle">
              {tForm('subtitle.label')}
            </Label>
            <Input
              id="inspector-node-subtitle"
              value={selectedNode.subtitle ?? ''}
              maxLength={surveyNodeConfig.subtitle.maxLength}
              spellCheck={false}
              onChange={handleNodePatch('subtitle')}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="inspector-node-description">
              {tForm('description.label')}
            </Label>
            <Input
              id="inspector-node-description"
              value={selectedNode.description ?? ''}
              maxLength={surveyNodeConfig.description.maxLength}
              spellCheck={false}
              onChange={handleNodePatch('description')}
            />
          </div>
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
        <DrawerContent className="h-full max-h-[90vh]">
          <DrawerHeader className="border-b">
            <h2 className="text-lg font-semibold">{t('inspector.title')}</h2>
          </DrawerHeader>
          <ScrollArea className="min-h-0 flex-1">{content}</ScrollArea>
          <DrawerFooter className="border-t">
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
      <ScrollArea className="min-h-0 flex-1">{content}</ScrollArea>
    </div>
  )
}
