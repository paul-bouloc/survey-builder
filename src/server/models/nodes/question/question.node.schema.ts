
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { Schema } from 'mongoose'
import { NodeSchema } from '../node'
import { QuestionConfigSchema } from './question-config.node.schema'

const QuestionNodeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },

    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    config: {
      type: QuestionConfigSchema,
      required: true,
    },

    children: {
      type: [NodeSchema],
      default: undefined,
    },
  },
  { _id: false }
)

NodeSchema.discriminator(NodeKind.QUESTION, QuestionNodeSchema)
