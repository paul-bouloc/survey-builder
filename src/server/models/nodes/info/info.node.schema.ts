import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { Schema } from 'mongoose'
import { NodeSchema } from '../node'

const InfoNodeSchema = new Schema(
  {
    info: {
      type: new Schema(
        {
          type: {
            type: String,
            required: true,
            enum: ['info', 'warning', 'error', 'success', 'neutral']
          },
          title: {
            type: String,
            default: ''
          },
          description: {
            type: String,
            default: ''
          }
        },
        { _id: false }
      ),
      required: true
    }
  },
  { _id: false }
)

NodeSchema.discriminator(NodeKind.INFO, InfoNodeSchema)
