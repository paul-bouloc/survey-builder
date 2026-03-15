import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { surveyNodeConfig } from '@/features/surveys/editor/config/survey-node.config'
import { useTranslations } from 'next-intl'
import type { SurveyInspectorFieldProps } from './survey-inspector-field.types'

const id = 'inspector-node-title'

export function NodeFieldTitle({ node, onPatch }: SurveyInspectorFieldProps) {
  const t = useTranslations('form.inputs')

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{t('title.label')}</Label>
      <Input
        id={id}
        value={node.title ?? ''}
        maxLength={surveyNodeConfig.title.maxLength}
        spellCheck={false}
        onChange={e => onPatch({ title: e.target.value || null })}
        autoComplete="off"
      />
    </div>
  )
}
