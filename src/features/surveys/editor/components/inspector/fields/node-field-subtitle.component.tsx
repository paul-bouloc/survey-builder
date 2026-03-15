import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { surveyNodeConfig } from '@/features/surveys/editor/config/survey-node.config'
import { useTranslations } from 'next-intl'
import type { SurveyInspectorFieldProps } from './survey-inspector-field.types'

const id = 'inspector-node-subtitle'

export function NodeFieldSubtitle({
  node,
  onPatch
}: SurveyInspectorFieldProps) {
  const t = useTranslations('form.inputs')

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{t('subtitle.label')}</Label>
      <Input
        id={id}
        value={node.subtitle ?? ''}
        maxLength={surveyNodeConfig.subtitle.maxLength}
        spellCheck={false}
        onChange={e => onPatch({ subtitle: e.target.value || null })}
        autoComplete="off"
      />
    </div>
  )
}
