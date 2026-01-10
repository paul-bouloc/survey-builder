import { ConditionOperator } from '@/shared/types/surveys/condition.type'
import { Schema } from 'mongoose'

export const ConditionSchema = new Schema(
  {
    op: { type: String, required: true, enum: Object.values(ConditionOperator) }
  },
  { _id: false, discriminatorKey: 'op' }
)

const SimpleConditionSchema = new Schema(
  {
    path: { type: String, required: false },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
)

const ExistsConditionSchema = new Schema(
  {
    path: { type: String, required: true }
  },
  { _id: false }
)

const LogicalConditionSchema = new Schema(
  {
    conditions: {
      type: [ConditionSchema],
      required: true,
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr) && arr.length > 0,
        message: 'conditions must not be empty'
      }
    }
  },
  { _id: false }
)

const NotConditionSchema = new Schema(
  {
    condition: { type: ConditionSchema, required: true }
  },
  { _id: false }
)

// Simple Conditions
ConditionSchema.discriminator(ConditionOperator.EQUALS, SimpleConditionSchema)
ConditionSchema.discriminator(
  ConditionOperator.NOT_EQUALS,
  SimpleConditionSchema
)
ConditionSchema.discriminator(ConditionOperator.IN, SimpleConditionSchema)
ConditionSchema.discriminator(ConditionOperator.INCLUDES, SimpleConditionSchema)
ConditionSchema.discriminator(
  ConditionOperator.GREATER_THAN,
  SimpleConditionSchema
)
ConditionSchema.discriminator(
  ConditionOperator.GREATER_THAN_OR_EQUALS,
  SimpleConditionSchema
)
ConditionSchema.discriminator(
  ConditionOperator.LESS_THAN,
  SimpleConditionSchema
)
ConditionSchema.discriminator(
  ConditionOperator.LESS_THAN_OR_EQUALS,
  SimpleConditionSchema
)

// Exists Condition
ConditionSchema.discriminator(ConditionOperator.EXISTS, ExistsConditionSchema)

// Logical Conditions
ConditionSchema.discriminator(ConditionOperator.AND, LogicalConditionSchema)
ConditionSchema.discriminator(ConditionOperator.OR, LogicalConditionSchema)

// Not Condition
ConditionSchema.discriminator(ConditionOperator.NOT, NotConditionSchema)
