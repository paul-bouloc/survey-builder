import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { Schema } from 'mongoose'
import { NodeSchema } from '../node'

const PageNodeSchema = new Schema(
  {
    children: {
      type: [NodeSchema],
      required: true,
      default: [],
    },

    page: {
      type: new Schema(
        {
          skippable: {
            type: Boolean,
            required: true,
            default: false,
          },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { _id: false }
)

NodeSchema.discriminator(NodeKind.PAGE, PageNodeSchema)
