export type QuestionConfig =
  | TextConfig
  | TextareaConfig
  | NumberConfig
  | DateConfig
  | RadioConfig
  | CheckboxesConfig
  | SelectConfig
  | ScaleConfig
  | FormConfig

/* ---- basic ---- */

export interface TextConfig {
  type: 'text'
  placeholder?: string
  maxLength?: number
  minLength?: number
  pattern?: string // regex string (engine decides how to apply)
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
  unit?: string // "kg", "€", etc
  commit?: 'change' | 'blur' | 'next'
}

export interface DateConfig {
  type: 'date'
  min?: string // ISO date
  max?: string // ISO date
  commit?: 'change' | 'blur' | 'next'
}

/* ---- choices ---- */

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
  commit?: 'change' | 'next' // radio often commits on change
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

/* ---- scales ---- */

export interface ScaleConfig {
  type: 'scale'
  min: number
  max: number
  step?: number
  /**
   * Optional mapping for labels at specific ticks (e.g. 0="Low",10="High")
   */
  labels?: Record<number, string>
  commit?: 'change' | 'next'
}

/* ---- composite ---- */

export type FormFieldType = 'text' | 'number' | 'date' | 'select'

export interface FormFieldBase {
  key: string // unique within this form question
  label: string
  required?: boolean
  helperText?: string
}

export interface FormTextField extends FormFieldBase {
  type: 'text'
  placeholder?: string
  maxLength?: number
}

export interface FormNumberField extends FormFieldBase {
  type: 'number'
  min?: number
  max?: number
  step?: number
  integer?: boolean
  unit?: string
}

export interface FormDateField extends FormFieldBase {
  type: 'date'
  min?: string
  max?: string
}

export interface FormSelectField extends FormFieldBase {
  type: 'select'
  options: ChoiceOption[]
  placeholder?: string
}

export type FormField =
  | FormTextField
  | FormNumberField
  | FormDateField
  | FormSelectField

export interface FormConfig {
  type: 'form'
  fields: FormField[]
  layout?: 'stack' | 'grid'
  columns?: number
  commit?: 'next' // usually commit on next step
}
