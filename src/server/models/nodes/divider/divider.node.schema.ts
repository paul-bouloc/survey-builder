import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { Schema } from 'mongoose'
import { NodeSchema } from '../node'

const DividerNodeSchema = new Schema({}, { _id: false })

NodeSchema.discriminator(NodeKind.DIVIDER, DividerNodeSchema)
