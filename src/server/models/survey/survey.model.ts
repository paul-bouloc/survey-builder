import { model, models } from 'mongoose'
import type { ISurveyDocument, SurveyModel } from './survey.document'
import { SurveySchema } from './survey.schema'

export const Survey: SurveyModel =
  (models.Survey as SurveyModel) ||
  model<ISurveyDocument, SurveyModel>('Survey', SurveySchema)

export default Survey
