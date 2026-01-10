import { generateShortId } from '@/lib/string'
import { NodeKind } from '@/shared/types/surveys/nodes/node.type'
import { SurveyStatus } from '@/shared/types/surveys/survey.type'
import { Schema } from 'mongoose'
import { NodeSchema } from '../nodes'
import type { ISurveyDocument, SurveyModel } from './survey.document'

export const SurveySchema = new Schema<ISurveyDocument, SurveyModel>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: generateShortId,
      validate: {
        validator: (v: string) => v.length === 6,
        message: 'shortId must be exactly 6 characters'
      }
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    },

    title: { type: String, required: true, trim: true },
    subtitle: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },

    status: {
      type: String,
      required: true,
      enum: Object.values(SurveyStatus),
      default: SurveyStatus.DRAFT,
      index: true
    },

    pages: {
      type: [NodeSchema],
      required: true,
      default: [],
      validate: {
        validator: (arr: any[]) =>
          Array.isArray(arr) && arr.every(n => n?.kind === NodeKind.PAGE),
        message: 'pages must contain only PageNode (kind="page")'
      }
    },

    publishedAt: { type: Date, required: false, default: null, index: true },
    archivedAt: { type: Date, required: false, default: null, index: true },

    responseCount: { type: Number, required: true, default: 0, min: 0 }
  },
  {
    timestamps: true,
    collection: 'surveys'
  }
)
