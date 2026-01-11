import { TriggerTiming } from '@/shared/types/surveys/trigger.type'
import { Schema } from 'mongoose'

import { ActionSchema } from '../action'
import { ConditionSchema } from '../condition'

export const TriggerRuleSchema = new Schema(
  {
    timing: {
      type: String,
      required: true,
      enum: Object.values(TriggerTiming)
    },

    // optional: if omitted -> always triggers on that timing
    when: {
      type: ConditionSchema,
      required: false
    },

    actions: {
      type: [ActionSchema],
      required: true,
      default: [],
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr),
        message: 'actions must be an array'
      }
    },

    dedupeKey: {
      type: String,
      required: false,
      trim: true,
      maxlength: 200
    }
  },
  { _id: false }
)
