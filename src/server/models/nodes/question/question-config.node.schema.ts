import { QuestionType } from '@/shared/types/surveys/nodes/question.node.type'
import { Schema } from 'mongoose'

export const QuestionConfigSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(QuestionType)
    }
  },
  { _id: false, discriminatorKey: 'type' }
)

/* ---------- BASIC ---------- */

QuestionConfigSchema.discriminator(
  QuestionType.TEXT,
  new Schema(
    {
      placeholder: String,
      maxLength: Number,
      minLength: Number,
      pattern: String,
      commit: { type: String, enum: ['change', 'blur', 'next'] }
    },
    { _id: false }
  )
)

QuestionConfigSchema.discriminator(
  QuestionType.TEXTAREA,
  new Schema(
    {
      placeholder: String,
      maxLength: Number,
      minLength: Number,
      rows: Number,
      commit: { type: String, enum: ['blur', 'next'] }
    },
    { _id: false }
  )
)

QuestionConfigSchema.discriminator(
  QuestionType.NUMBER,
  new Schema(
    {
      min: Number,
      max: Number,
      step: Number,
      integer: Boolean,
      unit: String,
      commit: { type: String, enum: ['change', 'blur', 'next'] }
    },
    { _id: false }
  )
)

QuestionConfigSchema.discriminator(
  QuestionType.DATE,
  new Schema(
    {
      min: String,
      max: String,
      commit: { type: String, enum: ['change', 'blur', 'next'] }
    },
    { _id: false }
  )
)

/* ---------- CHOICES ---------- */

const ChoiceOptionSchema = new Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    description: String,
    disabled: Boolean
  },
  { _id: false }
)

QuestionConfigSchema.discriminator(
  QuestionType.RADIO,
  new Schema(
    {
      options: { type: [ChoiceOptionSchema], required: true },
      layout: { type: String, enum: ['stack', 'grid'] },
      commit: { type: String, enum: ['change', 'next'] }
    },
    { _id: false }
  )
)

QuestionConfigSchema.discriminator(
  QuestionType.CHECKBOXES,
  new Schema(
    {
      options: { type: [ChoiceOptionSchema], required: true },
      minChecked: Number,
      maxChecked: Number,
      layout: { type: String, enum: ['stack', 'grid'] },
      commit: { type: String, enum: ['change', 'next'] }
    },
    { _id: false }
  )
)

QuestionConfigSchema.discriminator(
  QuestionType.SELECT,
  new Schema(
    {
      options: { type: [ChoiceOptionSchema], required: true },
      placeholder: String,
      searchable: Boolean,
      commit: { type: String, enum: ['change', 'next'] }
    },
    { _id: false }
  )
)

/* ---------- SCALE ---------- */

QuestionConfigSchema.discriminator(
  QuestionType.SCALE,
  new Schema(
    {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      step: Number,
      labels: {
        type: Map,
        of: String
      },
      commit: { type: String, enum: ['change', 'next'] }
    },
    { _id: false }
  )
)
