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
        validator: (arr: unknown[]) =>
          arr
            ? Array.isArray(arr) &&
              arr.every((n: any) => n?.kind !== NodeKind.PAGE)
            : true,
        message:
          'children must be an array of nodes and must not contain PageNode'
      }
    },

    group: {
      type: new Schema(
        {
          title: { type: String, default: '' },
          description: { type: String, default: '' }
        },
        { _id: false }
      ),
      required: true
    }
  },
  { _id: false }
)

NodeSchema.discriminator(NodeKind.GROUP, GroupNodeSchema)
