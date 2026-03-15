import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import { useTranslations } from 'next-intl'
import type {
  TextQuestionNode,
  TextareaQuestionNode
} from '@/shared/types/surveys/nodes/question.node.type'

const id = 'inspector-node-placeholder'

interface NodeFieldPlaceholderProps {
  node: TextQuestionNode | TextareaQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function NodeFieldPlaceholder({
  node,
  onPatch
}: NodeFieldPlaceholderProps) {
  const t = useTranslations('form.inputs')
  const value = node.config.placeholder ?? ''

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{t('placeholder.label')}</Label>
      <Input
        id={id}
        value={value}
        spellCheck={false}
        onChange={e =>
          onPatch({
            config: { ...node.config, placeholder: e.target.value || undefined }
          })
        }
        autoComplete="off"
      />
    </div>
  )
}
