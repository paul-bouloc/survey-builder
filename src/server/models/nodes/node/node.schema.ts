import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { Schema } from 'mongoose'

import { ConditionSchema } from '../../condition'
import { TriggerRuleSchema } from '../../trigger'

export const NodeSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },

    kind: {
      type: String,
      required: true,
      enum: Object.values(NodeKind)
    },

    order: {
      type: Number,
      required: true
    },

    title: {
      type: String,
      required: false,
      default: null
    },

    subtitle: {
      type: String,
      required: false,
      default: null
    },

    description: {
      type: String,
      required: false,
      default: null
    },

    code: {
      type: String,
      required: false,
      default: null,
      index: true
    },

    condition: {
      type: ConditionSchema,
      required: false,
      default: null
    },

    triggers: {
      type: [TriggerRuleSchema],
      required: true,
      default: []
    }
  },
  {
    _id: false,
    discriminatorKey: 'kind'
  }
)
