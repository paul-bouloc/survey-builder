import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command'
import { SurveyEditorNodeKindIcon } from '@/features/surveys/editor/components/nodes/survey-editor-node-kind-icon.component'
import { addNode } from '@/features/surveys/editor/state'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import type { PageNode } from '@/shared/types/surveys/nodes/page.node.type'
import { QuestionType } from '@/shared/types/surveys/nodes/question.node.type'
import { useAppDispatch } from '@/store/hooks'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useCallback, useState } from 'react'

interface SurveyEditorAddBlockButtonProps {
  page: PageNode
}

const TOP_LEVEL_KINDS = [
  NodeKind.GROUP,
  NodeKind.INFO,
  NodeKind.DIVIDER
] as const

const QUESTION_TYPES = [
  QuestionType.TEXT,
  QuestionType.TEXTAREA,
  QuestionType.NUMBER,
  QuestionType.DATE,
  QuestionType.RADIO,
  QuestionType.CHECKBOXES,
  QuestionType.SELECT,
  QuestionType.SCALE
] as const

export function SurveyEditorAddBlockButton({
  page
}: SurveyEditorAddBlockButtonProps) {
  const dispatch = useAppDispatch()
  const tPages = useTranslations('surveys.edit.pages')
  const tNodes = useTranslations('surveys.edit.nodes')

  const [open, setOpen] = useState(false)

  const handleAddBloc = useCallback(
    (kind: 'group' | 'info' | 'divider') => {
      dispatch(addNode({ pageId: page.id, kind }))
      setOpen(false)
    },
    [dispatch, page.id]
  )

  const handleAddQuestion = useCallback(
    (questionType: (typeof QUESTION_TYPES)[number]) => {
      dispatch(addNode({ pageId: page.id, questionType }))
      setOpen(false)
    },
    [dispatch, page.id]
  )

  return (
    <div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="w-full! bg-neutral-200/40! hover:bg-neutral-200/60! dark:bg-neutral-800/50! dark:hover:bg-neutral-800/70!"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4 shrink-0" strokeWidth={1.5} />
        {tPages('addNode')}
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder={tPages('addNode')} />
          <CommandList>
            <CommandEmpty>{tPages('addNode')}</CommandEmpty>
            <CommandGroup heading={tNodes('addBlockGroupBlocs')}>
              {TOP_LEVEL_KINDS.map(kind => (
                <CommandItem
                  key={kind}
                  value={`${kind}-${tNodes(`kind.${kind}`)}`}
                  onSelect={() => handleAddBloc(kind)}
                  className="flex items-center gap-2"
                >
                  <SurveyEditorNodeKindIcon
                    kind={kind}
                    className="text-primary size-4"
                  />
                  <span>{tNodes(`kind.${kind}`)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={tNodes('addBlockGroupQuestions')}>
              {QUESTION_TYPES.map(questionType => (
                <CommandItem
                  key={questionType}
                  value={`${questionType}-${tNodes(`questionType.${questionType}`)}`}
                  onSelect={() => handleAddQuestion(questionType)}
                  className="flex items-center gap-2"
                >
                  <SurveyEditorNodeKindIcon
                    kind={NodeKind.QUESTION}
                    questionType={questionType}
                    className="text-primary size-4"
                  />
                  <span>{tNodes(`questionType.${questionType}`)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
