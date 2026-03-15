import {
  BaseNode,
  Node,
  NodeKind
} from '@/shared/types/surveys/nodes/node.type'

export const QuestionType = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  DATE: 'date',
  RADIO: 'radio',
  CHECKBOXES: 'checkboxes',
  SELECT: 'select',
  SCALE: 'scale'
} as const

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]

export type QuestionConfig =
  | TextConfig
  | TextareaConfig
  | NumberConfig
  | DateConfig
  | RadioConfig
  | CheckboxesConfig
  | SelectConfig
  | ScaleConfig

/* ---- configs ---- */

export interface TextConfig {
  type: 'text'
  placeholder?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  commit?: 'change' | 'blur' | 'next'
}

export interface TextareaConfig {
  type: 'textarea'
  placeholder?: string
  maxLength?: number
  minLength?: number
  rows?: number
  commit?: 'blur' | 'next'
}

export interface NumberConfig {
  type: 'number'
  min?: number
  max?: number
  step?: number
  integer?: boolean
  unit?: string
  commit?: 'change' | 'blur' | 'next'
}

export interface DateConfig {
  type: 'date'
  min?: string
  max?: string
  commit?: 'change' | 'blur' | 'next'
}

export interface ChoiceOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioConfig {
  type: 'radio'
  options: ChoiceOption[]
  layout?: 'stack' | 'grid'
  commit?: 'change' | 'next'
}

export interface CheckboxesConfig {
  type: 'checkboxes'
  options: ChoiceOption[]
  minChecked?: number
  maxChecked?: number
  layout?: 'stack' | 'grid'
  commit?: 'change' | 'next'
}

export interface SelectConfig {
  type: 'select'
  options: ChoiceOption[]
  placeholder?: string
  searchable?: boolean
  commit?: 'change' | 'next'
}

export interface ScaleConfig {
  type: 'scale'
  min: number
  max: number
  step?: number
  labels?: Record<number, string>
  commit?: 'change' | 'next'
}

/* ---- base question node (common fields) ---- */

export interface BaseQuestionNode extends BaseNode {
  kind: typeof NodeKind.QUESTION
  required?: boolean
  children?: Node[]
}

/* ---- discriminated question node variants ---- */

export interface TextQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.TEXT
  config: TextConfig
}

export interface TextareaQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.TEXTAREA
  config: TextareaConfig
}

export interface NumberQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.NUMBER
  config: NumberConfig
}

export interface DateQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.DATE
  config: DateConfig
}

export interface RadioQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.RADIO
  config: RadioConfig
}

export interface CheckboxesQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.CHECKBOXES
  config: CheckboxesConfig
}

export interface SelectQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.SELECT
  config: SelectConfig
}

export interface ScaleQuestionNode extends BaseQuestionNode {
  type: typeof QuestionType.SCALE
  config: ScaleConfig
}

/* ---- union ---- */

export type QuestionNode =
  | TextQuestionNode
  | TextareaQuestionNode
  | NumberQuestionNode
  | DateQuestionNode
  | RadioQuestionNode
  | CheckboxesQuestionNode
  | SelectQuestionNode
  | ScaleQuestionNode
