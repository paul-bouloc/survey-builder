import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SurveyItemPatch } from '@/features/surveys/editor/state'
import type {
  NumberQuestionNode,
  ScaleQuestionNode
} from '@/shared/types/surveys/nodes/question.node.type'

const id = 'inspector-node-max'

interface NodeFieldMaxProps {
  node: NumberQuestionNode | ScaleQuestionNode
  onPatch: (patch: SurveyItemPatch) => void
}

export function NodeFieldMax({ node, onPatch }: NodeFieldMaxProps) {
  const value = node.config.max ?? ''

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>Max</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={e => {
          const v = e.target.value
          const parsed = v === '' ? undefined : Number(v)
          onPatch({
            config: { ...node.config, max: parsed }
          })
        }}
      />
    </div>
  )
}
