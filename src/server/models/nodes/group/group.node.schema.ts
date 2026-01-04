import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { Schema } from 'mongoose'
import { NodeSchema } from '../node'

const GroupNodeSchema = new Schema(
  {
    children: {
      type: [NodeSchema],
      required: true,
      default: [],
      validate: {
        validator: (arr: unknown[]) => Array.isArray(arr) && arr.length > 0,
        message: 'children must be an array of nodes and not empty',
      },
    },

    group: {
      type: new Schema(
        {
          title: { type: String, required: true },
          description: { type: String, required: true },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { _id: false }
)

NodeSchema.discriminator(NodeKind.GROUP, GroupNodeSchema)
