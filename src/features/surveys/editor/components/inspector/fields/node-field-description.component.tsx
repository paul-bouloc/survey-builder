import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { surveyNodeConfig } from '@/features/surveys/editor/config/survey-node.config'
import { useTranslations } from 'next-intl'
import type { SurveyInspectorFieldProps } from './survey-inspector-field.types'

const id = 'inspector-node-description'

export function NodeFieldDescription({
  node,
  onPatch
}: SurveyInspectorFieldProps) {
  const t = useTranslations('form.inputs')

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{t('description.label')}</Label>
      <Input
        id={id}
        value={node.description ?? ''}
        maxLength={surveyNodeConfig.description.maxLength}
        spellCheck={false}
        onChange={e => onPatch({ description: e.target.value || null })}
        autoComplete="off"
      />
    </div>
  )
}
