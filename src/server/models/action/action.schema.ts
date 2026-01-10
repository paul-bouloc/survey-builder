import { ActionType } from '@/shared/types/surveys/action.type'
import { Schema } from 'mongoose'

const BaseActionSchema = new Schema(
  {
    type: { type: String, required: true, enum: Object.values(ActionType) }
  },
  { _id: false, discriminatorKey: 'type' }
)

const FlagActionSchema = new Schema(
  {
    path: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { _id: false }
)

const UnflagActionSchema = new Schema(
  {
    path: { type: String, required: true }
  },
  { _id: false }
)

const GotoActionSchema = new Schema(
  {
    target: {
      type: String,
      required: true,
      enum: ['NEXT', 'PREVIOUS', 'END', 'NODE']
    },
    nodeId: { type: String, required: false }
  },
  { _id: false }
)

const ToastActionSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ['info', 'success', 'warning', 'error']
    },
    message: { type: String, required: true },
    durationMs: { type: Number, required: false }
  },
  { _id: false }
)

const ConfirmActionSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    onCancel: { type: String, required: true, enum: ['stop', 'noop'] }
  },
  { _id: false }
)

export const ActionSchema = BaseActionSchema
ActionSchema.discriminator(ActionType.FLAG, FlagActionSchema)
ActionSchema.discriminator(ActionType.UNFLAG, UnflagActionSchema)
ActionSchema.discriminator(ActionType.GOTO, GotoActionSchema)
ActionSchema.discriminator(ActionType.TOAST, ToastActionSchema)
ActionSchema.discriminator(ActionType.CONFIRM, ConfirmActionSchema)
