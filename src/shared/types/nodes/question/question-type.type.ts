export const QuestionType = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  NUMBER: 'number',
  DATE: 'date',
  RADIO: 'radio',
  CHECKBOXES: 'checkboxes',
  SELECT: 'select',
  SCALE: 'scale',
  FORM: 'form'
} as const

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]
