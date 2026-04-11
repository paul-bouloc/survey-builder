import * as React from 'react'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type {
  TextConfig,
  TextareaConfig
} from '@/shared/types/surveys/nodes/question.node.type'

import { CharacterCounter } from './character-counter.component'

export type RespondentTextQuestionFieldProps = {
  title: string
  description?: string | null
  config: TextConfig | TextareaConfig
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function RespondentTextQuestionField({
  title,
  description,
  config,
  value,
  onChange,
  disabled
}: RespondentTextQuestionFieldProps) {
  const id = React.useId()
  const { maxLength } = config
  const showCounter =
    typeof maxLength === 'number' && maxLength > 0 && Number.isFinite(maxLength)

  const inputProps = {
    id,
    disabled,
    placeholder: config.placeholder,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    ...(showCounter ? { maxLength } : {})
  }

  return (
    <Field>
      <FieldLabel htmlFor={id}>{title}</FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldContent className="gap-1.5">
        {config.type === 'text' ? (
          <Input type="text" autoComplete="off" {...inputProps} />
        ) : (
          <Textarea
            rows={config.rows ?? 4}
            autoComplete="off"
            {...inputProps}
          />
        )}
        {showCounter && maxLength != null ? (
          <CharacterCounter
            currentLength={value.length}
            maxLength={maxLength}
          />
        ) : null}
      </FieldContent>
    </Field>
  )
}
